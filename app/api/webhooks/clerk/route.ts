import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  // Get Clerk webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is missing. Webhook verification skipped.');
    return new Response('Webhook secret not set', { status: 500 });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying Clerk webhook:', err);
    return new Response('Error: Verification failed', {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Clerk webhook received: event=${eventType}, userId=${id}`);

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const email = evt.data.email_addresses?.[0]?.email_address;
    
    if (!id || !email) {
      return new Response('Error: Missing user metadata', { status: 400 });
    }

    // Upsert user in Supabase
    const { error } = await supabaseAdmin.from('users').upsert({
      id: id,
      email: email,
    }, { onConflict: 'id' });

    if (error) {
      console.error('Error syncing user to Supabase:', error);
      return new Response('Database write failed', { status: 500 });
    }

    console.log(`Successfully synced user ${id} (${email}) to Supabase.`);
  }

  if (eventType === 'user.deleted') {
    if (!id) {
      return new Response('Error: Missing user ID', { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user from Supabase:', error);
      return new Response('Database delete failed', { status: 500 });
    }

    console.log(`Successfully deleted user ${id} from Supabase.`);
  }

  return new Response('', { status: 200 });
}
