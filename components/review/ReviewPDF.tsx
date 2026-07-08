import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register a nice font if desired, otherwise standard fonts are available: Helvetica, Times-Roman, Courier
// Let's stick to standard Helvetica for ease of compiling without external web requests, ensuring it doesn't fail.

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    padding: 40,
    backgroundColor: '#ffffff',
    color: '#1e293b',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1',
    paddingBottom: 15,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 3,
  },
  scoreBadge: {
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    padding: 10,
    textAlign: 'center',
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4f46e5',
  },
  scoreLabel: {
    fontSize: 8,
    color: '#6366f1',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    backgroundColor: '#f1f5f9',
    padding: 6,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bulletList: {
    paddingLeft: 10,
  },
  bulletPoint: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 6,
  },
  bullet: {
    width: 12,
    fontSize: 10,
    color: '#6366f1',
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: '#334155',
  },
  keywordContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 5,
  },
  keywordTag: {
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 9,
    color: '#475569',
    marginRight: 6,
    marginBottom: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#94a3b8',
    fontSize: 8,
  },
});

interface ReviewPDFProps {
  review: {
    job_title: string;
    score: number;
    feedback: {
      strengths: string[];
      weaknesses: string[];
      suggestions: string[];
      keywords: string[];
    };
    created_at: string;
  };
}

export const ReviewPDF: React.FC<ReviewPDFProps> = ({ review }) => {
  const dateStr = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Resume Feedback Report</Text>
            <Text style={styles.subtitle}>Target Job: {review.job_title} | Generated: {dateStr}</Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreNumber}>{review.score}</Text>
            <Text style={styles.scoreLabel}>ATS Score</Text>
          </View>
        </View>

        {/* Strengths */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Strengths</Text>
          <View style={styles.bulletList}>
            {review.feedback.strengths.map((str, idx) => (
              <View key={`str-${idx}`} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{str}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weaknesses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identified Gaps</Text>
          <View style={styles.bulletList}>
            {review.feedback.weaknesses.map((weak, idx) => (
              <View key={`weak-${idx}`} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{weak}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Suggestions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Optimization Suggestions</Text>
          <View style={styles.bulletList}>
            {review.feedback.suggestions.map((sug, idx) => (
              <View key={`sug-${idx}`} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{sug}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Keywords */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Keywords & ATS Terms</Text>
          <View style={styles.keywordContainer}>
            {review.feedback.keywords.map((kw, idx) => (
              <Text key={`kw-${idx}`} style={styles.keywordTag}>
                {kw}
              </Text>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>ResumeAI — Powered by GPT-4o</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};
