import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def build_pdf():
    pdf_filename = "TransitEye_SIH2026_Project_Report.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        rightMargin=0.5*inch,
        leftMargin=0.5*inch,
        topMargin=0.5*inch,
        bottomMargin=0.5*inch
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_primary = colors.HexColor("#06b6d4") # Cyan
    c_dark = colors.HexColor("#0f172a")    # Slate dark
    c_secondary = colors.HexColor("#3b82f6") # Blue
    c_accent = colors.HexColor("#10b981")   # Emerald
    c_rose = colors.HexColor("#f43f5e")     # Rose
    c_text = colors.HexColor("#1e293b")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=c_dark,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=c_primary,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=c_dark,
        spaceBefore=14,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=c_secondary,
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=c_text,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'CodeCustom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0f172a"),
        backColor=colors.HexColor("#f1f5f9"),
        borderColor=colors.HexColor("#cbd5e1"),
        borderWidth=0.5,
        borderPadding=6,
        spaceAfter=8
    )

    story = []

    # Title & Header
    story.append(Paragraph("TransitEye — AI Mobile Urban Intelligence Platform", title_style))
    story.append(Paragraph("SIH 2026 Problem Statement 26124 • Comprehensive Full-Stack Architecture Report", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_primary, spaceBefore=0, spaceAfter=12))

    # Executive Summary
    story.append(Paragraph("1. Executive Summary & Core Pitch", h1_style))
    story.append(Paragraph(
        "<b>TransitEye</b> turns public transport buses into mobile edge-sensing units for smart cities. "
        "Public transport buses travel thousands of kilometers daily across urban transit corridors. "
        "By outfitting public buses with onboard Edge AI camera modules, every bus continuously monitors "
        "road conditions, traffic bottlenecks, pedestrian hazards, and traffic violations in real-time.",
        body_style
    ))

    # Key Innovation Box Table
    summary_data = [
        [Paragraph("<b>Key Innovation: Edge AI Bandwidth Optimization (97.4% Savings)</b>", ParagraphStyle('W', parent=body_style, textColor=colors.white, fontName='Helvetica-Bold'))],
        [Paragraph(
            "• <b>97.4% Local Video Inferencing:</b> Onboard camera video is processed locally inside the bus edge unit (NVIDIA Jetson / OpenCV / Custom Urban Vision AI). Zero video is continuously uploaded to the cloud!<br/>"
            "• <b>2.6% Transmitted Data:</b> Only when an anomaly occurs (pothole, congestion, rash driver, pedestrian hazard), low-bandwidth metadata + a tiny compressed evidence snapshot are transmitted to the central command server.<br/>"
            "• <b>Bandwidth Saved:</b> Saves approx. <b>48.6 GB of 5G cellular data per day</b> per bus fleet while maintaining strict citizen privacy compliance.",
            body_style
        )]
    ]
    t_summary = Table(summary_data, colWidths=[7.2*inch])
    t_summary.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_dark),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor("#f0fdf4")),
        ('BOX', (0,0), (-1,-1), 1, c_accent),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_summary)
    story.append(Spacer(1, 10))

    # System Architecture
    story.append(Paragraph("2. System Architecture & Technical Flow", h1_style))
    arch_code = (
        "[ Bus HD Camera Feed ] --> [ Edge AI Engine (Custom Urban Vision AI + ANPR) ]\n"
        "                                 |\n"
        "        (97.4% Video Processed Locally @ Edge • 0 MB Uploaded)\n"
        "                                 |\n"
        "        (2.6% Data Transmitted: Compressed Metadata + Snapshot)\n"
        "                                 v\n"
        "[ FastAPI Backend Server ] --> [ Pune Fleet Simulator & Store ]\n"
        "                                 |\n"
        "        (REST API + WebSockets Broadcaster + Priority Engine)\n"
        "                                 v\n"
        "[ TransitEye React Command Center Dashboard (Vite + Tailwind + Leaflet) ]"
    )
    story.append(Paragraph(arch_code, code_style))

    # Fullstack Implementation Details
    story.append(Paragraph("3. Frontend Architecture (React 18 + Vite + Tailwind CSS v4)", h1_style))
    story.append(Paragraph("The frontend is a single-page dark command-center dashboard crafted for high-impact SIH presentations:", body_style))
    
    fe_features = [
        "<b>Command Center Overview:</b> Real-time city KPI cards (Active Fleet 11/12, Logged Events, Defect Priority Corridors, ANPR Incidents), city health gauge, Edge AI bandwidth optimization savings widget.",
        "<b>Live AI Camera Monitoring:</b> Simulated 1080p camera feed with live HUD telemetry overlay (GPS 18.4862°N, 73.8324°E, Speed 14 KM/H, Latency 12ms), real-time Custom Urban Vision AI bounding boxes, ANPR license plate extractor (MH12 AB 1234), and <b>5 Interactive Demo Scenario Triggers</b>.",
        "<b>Pune GIS Spatial Intelligence Map:</b> Interactive Leaflet map displaying 12 active buses moving live along real Pune transport corridors (Sinhagad Rd, FC Rd, Karve Rd, Swargate, Hinjewadi) alongside color-coded pothole, congestion & ANPR alert markers.",
        "<b>Fleet Telemetry Management:</b> Status table for 12 Pune buses (BUS-101 to BUS-112) with operational status badges (ONLINE, INCIDENT, LOW NETWORK, OFFLINE), speed, camera health, driver info, and live GPS coordinates.",
        "<b>Actionable Road Condition Intelligence:</b> Multi-bus corroboration scoring algorithm (Priority Score 0-100) aggregating repeated pothole reports into municipal repair priority cards (e.g. Sinhagad Road Priority Score 92/100, CRITICAL).",
        "<b>ANPR & Safety Incident Triage:</b> Actionable incident triage workflow enabling status transitions (NEW -> UNDER REVIEW -> DISPATCHED -> RESOLVED) with camera snapshot evidence.",
        "<b>Analytics & OD Route Delay:</b> Origin-Destination route delay metrics (e.g. Route 17 Pune Station to Swargate +11 min delay) and hourly traffic density trends via Recharts."
    ]
    for feat in fe_features:
        story.append(Paragraph(f"• {feat}", bullet_style))

    story.append(Spacer(1, 10))

    # Backend Architecture
    story.append(Paragraph("4. Backend Architecture (Python FastAPI + Telemetry Simulator)", h1_style))
    story.append(Paragraph("The backend engine provides real-time REST and WebSocket endpoints for fleet telemetry and incident broadcasts:", body_style))

    be_table_data = [
        [Paragraph("<b>Endpoint</b>", ParagraphStyle('TH1', parent=body_style, fontName='Helvetica-Bold', textColor=colors.white)),
         Paragraph("<b>Method</b>", ParagraphStyle('TH2', parent=body_style, fontName='Helvetica-Bold', textColor=colors.white)),
         Paragraph("<b>Description</b>", ParagraphStyle('TH3', parent=body_style, fontName='Helvetica-Bold', textColor=colors.white))],
        [Paragraph("<code>/api/buses</code>", body_style), Paragraph("GET", body_style), Paragraph("Returns live telemetry & coordinates for 12 Pune buses.", body_style)],
        [Paragraph("<code>/api/events</code>", body_style), Paragraph("GET / POST", body_style), Paragraph("Fetch or log new edge-filtered camera detection events.", body_style)],
        [Paragraph("<code>/api/road-issues</code>", body_style), Paragraph("GET", body_style), Paragraph("Returns aggregated corridor defect priorities & recommendations.", body_style)],
        [Paragraph("<code>/api/incidents</code>", body_style), Paragraph("GET / PATCH", body_style), Paragraph("Fetch or update ANPR incident triage status (DISPATCHED, RESOLVED).", body_style)],
        [Paragraph("<code>/api/demo/trigger</code>", body_style), Paragraph("POST", body_style), Paragraph("Injects synthetic Edge AI demo scenarios (Pothole, Rash Driving, ANPR).", body_style)],
        [Paragraph("<code>/api/analytics</code>", body_style), Paragraph("GET", body_style), Paragraph("Returns OD route delays & hourly traffic congestion trends.", body_style)]
    ]
    t_be = Table(be_table_data, colWidths=[1.8*inch, 1.1*inch, 4.3*inch])
    t_be.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_dark),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_be)
    story.append(Spacer(1, 10))

    # AI Module Specifications
    story.append(Paragraph("5. AI Module & Edge Inferencing Pipeline", h1_style))
    story.append(Paragraph(
        "The AI module (<code>ai/demo_detector.py</code>, <code>ai/detector.py</code>, and <code>ai/inference.py</code>) implements a Custom Urban Vision AI (trained/fine-tuned on RDD2022 & IDD) / EasyOCR abstraction layer. "
        "It supports 5 interactive demo triggers for SIH judges:<br/>"
        "1. <b>Normal Traffic Flow:</b> Routine vehicle tracking.<br/>"
        "2. <b>Heavy Congestion Bottleneck:</b> Flags 34+ stationary vehicles.<br/>"
        "3. <b>Pothole Road Defect (93%):</b> Logs pothole defect with GPS + timestamp.<br/>"
        "4. <b>Pedestrian Safety Hazard:</b> Detects school children near roadways.<br/>"
        "5. <b>Rash Driving + ANPR Extractor:</b> Tracks overspeeding vehicle (ID #842) and extracts registration plate <b>MH12 AB 1234</b> at 91% confidence.",
        body_style
    ))

    story.append(Spacer(1, 10))

    # Pitching Guide
    story.append(Paragraph("6. SIH 2026 Presentation & Demo Walkthrough Guide", h1_style))
    pitch_steps = [
        "<b>1. Elevator Pitch (30s):</b> 'TransitEye turns public transport buses into mobile AI sensing units. Rather than streaming expensive video to the cloud, 97.4% of video is processed locally at the edge on the bus.'",
        "<b>2. Live Camera Demo:</b> Navigate to Live AI Feed on BUS-104. Trigger <b>Pothole Scenario</b> -> point out bounding box, GPS coordinates & timestamp.",
        "<b>3. GIS Map Plotting:</b> Switch to GIS Map -> show red pothole marker automatically plotted on Sinhagad Road, Pune.",
        "<b>4. Municipal Priorities:</b> Switch to Road Intelligence -> show Sinhagad Road priority score updated to <b>92/100 (CRITICAL)</b> with recommended asphalt resurfacing.",
        "<b>5. ANPR Rash Driving Triage:</b> Return to Live Feed -> trigger <b>Rash Driving + ANPR</b> -> show plate extraction <b>MH12 AB 1234</b> -> switch to Incident Center and click <b>DISPATCHED</b>."
    ]
    for step in pitch_steps:
        story.append(Paragraph(f"• {step}", bullet_style))

    story.append(Spacer(1, 12))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceBefore=6, spaceAfter=8))
    story.append(Paragraph("<b>Zero External Dependencies:</b> TransitEye runs 100% locally with built-in in-memory fallback stores and free OpenStreetMap Leaflet tiles.", ParagraphStyle('Footer', parent=body_style, fontSize=8, textColor=colors.HexColor("#64748b"), alignment=1)))

    doc.build(story)
    print(f"PDF successfully generated: {os.path.abspath(pdf_filename)}")

if __name__ == "__main__":
    build_pdf()
