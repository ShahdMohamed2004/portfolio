#!/usr/bin/env python3
"""Build Shahd Mohamed's one-page, ATS-friendly CV PDF and web preview."""
from pathlib import Path
from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from PIL import Image
import subprocess

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
PDF = ASSETS / "shahd-cv.pdf"
PREVIEW = ASSETS / "shahd-cv-preview.webp"
NAVY = colors.HexColor("#173D54")
INK = colors.HexColor("#202A31")
MUTED = colors.HexColor("#52636D")
RULE = colors.HexColor("#9FB6C2")

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Name", fontName="Helvetica-Bold", fontSize=20, leading=22, alignment=TA_CENTER, textColor=INK, spaceAfter=2))
styles.add(ParagraphStyle(name="Tagline", fontName="Helvetica", fontSize=9.2, leading=11, alignment=TA_CENTER, textColor=NAVY, spaceAfter=3))
styles.add(ParagraphStyle(name="Contact", fontName="Helvetica", fontSize=7.7, leading=9, alignment=TA_CENTER, textColor=MUTED, spaceAfter=5))
styles.add(ParagraphStyle(name="SectionCV", fontName="Helvetica-Bold", fontSize=10, leading=11.8, textColor=NAVY, spaceBefore=7, spaceAfter=3, keepWithNext=True))
styles.add(ParagraphStyle(name="BodyCV", fontName="Helvetica", fontSize=8.75, leading=11, textColor=INK, spaceAfter=1.2))
styles.add(ParagraphStyle(name="RoleCV", fontName="Helvetica-Bold", fontSize=8.8, leading=10.3, textColor=INK))
styles.add(ParagraphStyle(name="DateCV", fontName="Helvetica-Bold", fontSize=8.0, leading=9.7, textColor=MUTED, alignment=TA_RIGHT))
styles.add(ParagraphStyle(name="BulletCV", fontName="Helvetica", fontSize=8.45, leading=10.25, leftIndent=9, firstLineIndent=-7, bulletIndent=0, textColor=INK, spaceAfter=0.5))
styles.add(ParagraphStyle(name="SmallCV", fontName="Helvetica", fontSize=8.35, leading=10, textColor=INK, spaceAfter=1))

story = []
def P(text, style):
    return Paragraph(text, styles[style])
def section(label):
    story.append(P(label.upper(), "SectionCV"))
    rule = Table([[""]], colWidths=[180*mm], rowHeights=[0.45])
    rule.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,-1), RULE)]))
    story.append(rule)
def role(title, org, date, bullets):
    head = Table([[P(f"{title}  |  {org}", "RoleCV"), P(date, "DateCV")]], colWidths=[143*mm, 37*mm], hAlign="LEFT")
    head.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0),("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0)]))
    items = [head]
    for b in bullets:
        items.append(P("•&nbsp; " + b, "BulletCV"))
    items.append(Spacer(1, 1.2))
    story.append(KeepTogether(items))

story += [P("Shahd Mohamed Siddiq", "Name"),
          P("EFL/ESL Educator  |  TEFL Specialist  |  Digital Pedagogy &amp; EdTech", "Tagline"),
          P('Giza, Egypt  |  +20 100 456 0964  |  <link href="mailto:shahdmohamed25042004@gmail.com" color="#52636D">shahdmohamed25042004@gmail.com</link>  |  <link href="https://www.linkedin.com/in/shahd-mohamed-5b2525294/" color="#173D54">LinkedIn</link>  |  <link href="https://shahdmohamed2004.github.io/portfolio/" color="#173D54">Portfolio</link>', "Contact")]

section("Professional Summary")
story.append(P("TEFL-trained English language educator and 2026 English Language and Translation graduate with hands-on experience teaching children at CURIOOkids Egypt and middle-school and university-level learners in supervised settings. Skilled in learner-centred lesson planning, communicative instruction, classroom assessment, and visual materials design. Combines classroom practice with digital pedagogy and evidence-informed approaches to make language learning clear, engaging, and measurable.", "BodyCV"))

section("Teaching Experience")
role("English Teacher (Part-Time)", "CURIOOkids Egypt", "Oct 2026 – Present", [
    "Deliver interactive English communication sessions for children through age-appropriate activities, games, and guided discussion.",
    "Build speaking, vocabulary, and practical language use while supporting learner participation and progress."
])
role("English Teaching Practicum", "MSA University", "Sep 2025 – May 2026", [
    "Delivered supervised English instruction to university-level learners and conducted classroom-based assessment activities.",
    "Designed and administered an English assessment for 12 university students, including test structure and timing."
])
role("English Teaching Intern", "Dar El Tarbiah Schools, Dokki", "Sep 2024 – May 2025", [
    "Combined classroom observation with hands-on English instruction for Prep-stage (middle-school) students.",
    "Prepared learner-centred lesson plans and activities, adapting instruction to students’ needs."
])

section("Selected Projects")
role("Visual Timeline Grammar Framework", "MSA University", "Sep 2025 – Jun 2026", [
    "Designed a visual-timeline approach for teaching Past Simple, Past Continuous, and Past Perfect.",
    "Quasi-experimental study with 12 dentistry students: mean grammar scores rose from 8.79 to 12.21; 87% reported increased engagement."
])
role("Digital English Proficiency Test Platform", "MSA University", "Apr 2026 – May 2026", [
    "Designed a four-skill English assessment covering listening, reading, writing, and speaking, and developed a digital testing platform with a printable exam version."
])
role("Interactive E-Learning Storyboard: Presentation Skills", "MSA University", "Sep 2025 – Dec 2025", [
    "Story-boarded a 113-screen interactive course with learning objectives, instructor-led video, guided practice, branching activities, and gamified formative assessment with corrective feedback."
])

section("Education")
for title, school, dates, gpa in [
    ("B.A. in English Language and Translation, TEFL Major", "MSA University", "2022 – 2026", "3.57/4.0"),
    ("B.A. in Language, TEFL &amp; Translation (Dual Degree)", "University of Bedfordshire", "2022 – 2026", "3.67/4.0"),
]:
    row = Table([[P(f"<b>{title}</b>  |  {school}  |  GPA: {gpa}", "SmallCV"), P(dates, "DateCV")]], colWidths=[143*mm,37*mm], hAlign="LEFT")
    row.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0),("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0)]))
    story.append(row)

section("Professional Development")
story.append(P("Introduction to the Cambridge CELTA Program (MSA × IH Cairo orientation, attended) — Feb 2025  •  High Impact Presentations Workshop, MSA Continuance Learning Center — Jul 2024", "SmallCV"))
section("Skills")
story.append(P("<b>Teaching:</b> EFL/ESL instruction, TEFL methodology, lesson planning, learner-centred and differentiated instruction, classroom management, formative assessment, teaching-materials design, ESP lesson and assessment design<br/><b>Digital &amp; instructional design:</b> Instructional design, interactive learning, digital pedagogy, EdTech integration, digital assessment platforms, Canva, Microsoft Office<br/><b>Professional:</b> Communication, student engagement, teamwork, adaptability", "SmallCV"))
section("Languages")
story.append(P("Arabic (Native)  •  English  •  Spanish", "SmallCV"))

def decorate(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(doc.leftMargin, A4[1]-13*mm, doc.width, 2.2, stroke=0, fill=1)
    canvas.restoreState()

ASSETS.mkdir(parents=True, exist_ok=True)
doc = SimpleDocTemplate(str(PDF), pagesize=A4, rightMargin=15*mm, leftMargin=15*mm, topMargin=17*mm, bottomMargin=13*mm, title="Shahd Mohamed Siddiq — CV", author="Shahd Mohamed Siddiq", subject="EFL/ESL Educator | TEFL Specialist")
doc.build(story, onFirstPage=decorate, onLaterPages=decorate)
# Render the first page to a crisp, proportionate WebP used by the portfolio CV preview.
subprocess.run(["pdftoppm", "-f", "1", "-l", "1", "-singlefile", "-png", "-r", "120", str(PDF), "/tmp/shahd-cv-preview"], check=True, stdout=subprocess.DEVNULL)
with Image.open("/tmp/shahd-cv-preview.png") as im:
    im.save(PREVIEW, "WEBP", quality=88, method=6)
print(f"Wrote {PDF} and {PREVIEW}")
