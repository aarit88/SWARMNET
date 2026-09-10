import { NextResponse } from "next/server";

interface IncidentItem {
  id: string;
  title: string;
  location: string;
  severity: "critical" | "high" | "medium";
  type: string;
  status: "active" | "contained" | "investigating";
  timestamp: string;
  assignedAgents: number;
}

const incidents: IncidentItem[] = [
  {
    id: "INC-20247-A",
    title: "Structural Fire",
    location: "Zone Delta (37.78°N, -122.41°W)",
    severity: "critical",
    type: "fire",
    status: "active",
    timestamp: new Date().toISOString(),
    assignedAgents: 8,
  },
  {
    id: "INC-20248-B",
    title: "Power Grid Anomaly",
    location: "Sector Echo (37.75°N, -122.43°W)",
    severity: "high",
    type: "power",
    status: "active",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    assignedAgents: 5,
  },
  {
    id: "INC-20249-C",
    title: "Flood Warning Conduit",
    location: "Aqueous Valve 4 (37.73°N, -122.39°W)",
    severity: "medium",
    type: "flood",
    status: "contained",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    assignedAgents: 3,
  },
];

export async function GET() {
  return NextResponse.json(incidents);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newIncident: IncidentItem = {
      id: `INC-${Date.now().toString().slice(-5)}`,
      title: body.title || "Emergency Alert",
      location: body.location || "Sector Central",
      severity: body.severity || "high",
      type: body.type || "general",
      status: "active",
      timestamp: new Date().toISOString(),
      assignedAgents: body.assignedAgents || 4,
    };
    incidents.unshift(newIncident);
    return NextResponse.json(newIncident, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
