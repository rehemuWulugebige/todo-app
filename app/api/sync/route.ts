import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function csvEscape(v: unknown) {
  if (v === null || v === undefined) return "";
  const s = String(v).replace(/"/g, '""');
  return /[",\n\r]/.test(s) ? `"${s}"` : s;
}

export async function POST() {
  try {
    const host = process.env.DATABRICKS_HOST;
    const token = process.env.DATABRICKS_TOKEN;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!host || !token || !supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Missing required environment variables" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase
      .from("todos")
      .select("id,title,completed,date,created_at,updated_at")
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Supabase fetch failed", details: error.message },
        { status: 500 }
      );
    }

    const rows = data ?? [];
    const header = "id,title,completed,date,created_at,updated_at";
    const body = rows
      .map((r) =>
        [
          csvEscape(r.id),
          csvEscape(r.title),
          csvEscape(r.completed),
          csvEscape(r.date),
          csvEscape(r.created_at),
          csvEscape(r.updated_at),
        ].join(",")
      )
      .join("\n");

    const csv = `${header}\n${body}`;

    const volumePath = "/Volumes/workspace/default/todos/todos_sync.csv";
    const url = `${host}/api/2.0/fs/files${volumePath}`;

    const resp = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/octet-stream",
      },
      body: csv,
    });

    if (!resp.ok) {
      const txt = await resp.text();
      return NextResponse.json(
        { error: "Databricks upload failed", details: txt },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, recordCount: rows.length });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Sync failed", details: message },
      { status: 500 }
    );
  }
}
