import { Document, Font, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { CvModel } from "@/content/cv";

// Plain single-column layout in a standard PDF font, so applicant tracking systems can read it.
// No hyphenation: split words ("tele-com") break keyword matching.
Font.registerHyphenationCallback((word) => [word]);
const s = StyleSheet.create({
  page: { paddingTop: 36, paddingBottom: 40, paddingHorizontal: 44, fontFamily: "Helvetica", fontSize: 9.5, lineHeight: 1.38, color: "#111111" },
  name: { fontFamily: "Helvetica-Bold", fontSize: 18, lineHeight: 1.2, textAlign: "center", color: "#1b2a4a" },
  headline: { fontSize: 10.5, lineHeight: 1.3, textAlign: "center", marginTop: 4 },
  contacts: { fontSize: 8.5, textAlign: "center", marginTop: 3, color: "#333333" },
  link: { color: "#1a56b8", textDecoration: "none" },
  section: { marginTop: 10 },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#1b2a4a",
    textTransform: "uppercase",
    borderBottomWidth: 0.9,
    borderBottomColor: "#1b2a4a",
    paddingBottom: 2,
    marginBottom: 4,
  },
  bold: { fontFamily: "Helvetica-Bold" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  sub: { fontFamily: "Helvetica-Oblique", color: "#555555", fontSize: 8.8 },
  group: { fontFamily: "Helvetica-Bold", color: "#2b4a8a", marginTop: 3 },
  bullet: { flexDirection: "row", paddingLeft: 8, marginTop: 1 },
  dot: { width: 9 },
  entry: { marginTop: 5 },
});

export function CvPdf({ cv }: { cv: CvModel }) {
  return (
    <Document title={`${cv.name} — CV`} author={cv.name} subject={cv.headline} creator={cv.name}>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{cv.name.toUpperCase()}</Text>
        <Text style={s.headline}>{cv.headline}</Text>
        {cv.contacts.length ? (
          <Text style={s.contacts}>
            {cv.contacts.map((c, i) => (
              <Text key={c.label}>
                {i ? "  |  " : ""}
                {c.href ? (
                  <Link src={c.href} style={s.link}>
                    {c.value}
                  </Link>
                ) : (
                  c.value
                )}
              </Text>
            ))}
          </Text>
        ) : null}

        {cv.sections.map((sec) => (
          <View key={sec.title} style={s.section}>
            <Text style={s.title}>{sec.title}</Text>
            {sec.kind === "text" ? <Text>{sec.text}</Text> : null}
            {sec.kind === "pairs"
              ? sec.pairs.map((p) => (
                  <Text key={p.label}>
                    <Text style={s.bold}>{p.label}: </Text>
                    {p.text}
                  </Text>
                ))
              : null}
            {sec.kind === "entries"
              ? sec.entries.map((e, i) => (
                  <View key={e.heading} style={i ? s.entry : undefined}>
                    <View style={s.row}>
                      <Text style={s.bold}>{e.heading}</Text>
                      {e.right ? <Text style={s.bold}>{e.right}</Text> : null}
                    </View>
                    {e.sub ? <Text style={s.sub}>{e.sub}</Text> : null}
                    {e.groups.map((g, j) => (
                      <View key={j}>
                        {g.name ? (
                          <Text style={s.group}>
                            {g.name}
                            {g.tag ? <Text style={s.sub}>{`  |  ${g.tag}`}</Text> : null}
                          </Text>
                        ) : null}
                        {g.bullets.map((b) => (
                          <View key={b} style={s.bullet}>
                            <Text style={s.dot}>•</Text>
                            <Text style={{ flex: 1 }}>{b}</Text>
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                ))
              : null}
          </View>
        ))}
      </Page>
    </Document>
  );
}
