import {
  Document,
  Page,
  Text,
  View,
  Link,
  Image,
  StyleSheet,
} from "@react-pdf/renderer"
import type { ResumeData } from "@/data/resume"

const colors = {
  black: "#111",
  gray: "#555",
  lightGray: "#999",
  border: "#ddd",
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: colors.black,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 48,
  },
  header: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  role: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row",
    gap: 16,
    fontSize: 9,
    color: colors.gray,
  },
  link: {
    color: colors.gray,
    textDecoration: "none",
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    marginTop: 16,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  aboutText: {
    fontSize: 10,
    color: colors.gray,
    lineHeight: 1.5,
  },
  entryContainer: {
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  entrySubtitle: {
    fontSize: 10,
    color: colors.gray,
  },
  entryPeriod: {
    fontSize: 9,
    color: colors.lightGray,
  },
  bullet: {
    fontSize: 9,
    color: colors.gray,
    marginLeft: 10,
    marginTop: 2,
    lineHeight: 1.4,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
  },
  tag: {
    fontSize: 8,
    color: colors.gray,
    backgroundColor: "#f3f3f3",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  skillCategory: {
    marginBottom: 4,
  },
  skillLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  skillValue: {
    fontSize: 9,
    color: colors.gray,
  },
})

interface ResumePDFProps {
  data: ResumeData
  sectionTitles: {
    about: string
    experience: string
    education: string
    skills: string
  }
  photoDataUrl?: string
}

export function ResumePDF({ data, sectionTitles, photoDataUrl }: ResumePDFProps) {
  return (
    <Document title={`${data.name} CV`} author={data.name}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {photoDataUrl && (
            <Image src={photoDataUrl} style={styles.photo} />
          )}
          <View style={styles.headerText}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.role}>{data.role}</Text>
            <View style={styles.contactRow}>
              <Text>{data.location}</Text>
              <Link src={`mailto:${data.email}`} style={styles.link}>
                {data.email}
              </Link>
              <Link src={data.github} style={styles.link}>
                GitHub
              </Link>
              <Link src={data.linkedin} style={styles.link}>
                LinkedIn
              </Link>
              <Link src="https://matejhoz.com" style={styles.link}>
                matejhoz.com
              </Link>
            </View>
          </View>
        </View>

        {/* About */}
        <View>
          <Text style={styles.sectionTitle}>{sectionTitles.about}</Text>
          <Text style={styles.aboutText}>{data.about}</Text>
        </View>

        {/* Experience */}
        <View>
          <Text style={styles.sectionTitle}>{sectionTitles.experience}</Text>
          {data.experience.map((job) => (
            <View key={`${job.company}-${job.period}`} style={styles.entryContainer}>
              <View style={styles.entryHeader}>
                <View>
                  <Text style={styles.entryTitle}>{job.title}</Text>
                  <Text style={styles.entrySubtitle}>{job.company}</Text>
                </View>
                <Text style={styles.entryPeriod}>{job.period}</Text>
              </View>
              {job.bullets.map((bullet, i) => (
                <Text key={i} style={styles.bullet}>
                  {"•  "}{bullet}
                </Text>
              ))}
              {job.tags && job.tags.length > 0 && (
                <View style={styles.tagsRow}>
                  {job.tags.map((tag) => (
                    <Text key={tag} style={styles.tag}>{tag}</Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Education */}
        <View>
          <Text style={styles.sectionTitle}>{sectionTitles.education}</Text>
          {data.education.map((edu) => (
            <View key={`${edu.school}-${edu.period}`} style={styles.entryContainer}>
              <View style={styles.entryHeader}>
                <View>
                  <Text style={styles.entryTitle}>{edu.degree}</Text>
                  <Text style={styles.entrySubtitle}>{edu.school}</Text>
                </View>
                <Text style={styles.entryPeriod}>{edu.period}</Text>
              </View>
              {edu.description && (
                <Text style={styles.bullet}>{edu.description}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Skills */}
        <View>
          <Text style={styles.sectionTitle}>{sectionTitles.skills}</Text>
          {Object.entries(data.skills).map(([category, items]) => (
            <View key={category} style={styles.skillCategory}>
              <Text>
                <Text style={styles.skillLabel}>{category}: </Text>
                <Text style={styles.skillValue}>{items.join(", ")}</Text>
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}
