#!/usr/bin/env python3
"""
build_alongside_overlap.py — same-tour / same-company "Served Alongside" generator.

Scrapes every soldier profile, computes each man's in-country tour window, and finds
other ORGANIC D Co men whose windows overlap. Emits:
  - same platoon + overlap  -> Tier 2 (basis "same-platoon-tour")
  - same company + overlap   -> Tier 3 (basis "same-tour")

The alongside.js build engine already routes any non-"same-platoon" basis to Tier 3, so
written links land in the right tier with zero engine changes.

MEMBERSHIP (the "Fanning problem"): everyone is treated as organic D Co UNLESS listed in
_data/alongside-exclude.json (attached units like the 229th Aviation / 2-19 Artillery, and
battalion commanders). The generator never guesses attachment from prose — it surfaces
overlap candidates for human review; confirmed attached men are added to the exclude file.

TOUR END DATE: departed -> else first assignment 'to' -> else (KIA) casualty date ->
else (survivor with arrived but no end) inferred DEROS = arrived + 365 days, FLAGGED.

Usage:
  python build_alongside_overlap.py --repo-dir <repo> --summary
  python build_alongside_overlap.py --repo-dir <repo> --review <slug>
  python build_alongside_overlap.py --repo-dir <repo> --write     # merges into soldiers/*/_alongside.json
"""
import argparse, json, os, re, sys
from datetime import datetime, timedelta
try:
    import yaml
except ImportError:
    sys.exit("pip install pyyaml")

def parse_fm(path):
    if not os.path.exists(path): return None
    raw = open(path, encoding="utf-8", errors="ignore").read()
    m = re.match(r'^﻿?---\r?\n([\s\S]*?)\r?\n---', raw)
    content = m.group(1) if m else (raw.split('---', 2)[1] if raw.startswith('---') else None)
    if not content: return None
    try: return yaml.safe_load(content)
    except Exception: return None

def pdate(v):
    if not v: return None
    v = str(v).strip().strip('"')
    for fmt in ('%Y-%m-%d', '%d %B %Y', '%B %d, %Y', '%d %b %Y'):
        try: return datetime.strptime(v, fmt)
        except ValueError: pass
    mm = re.search(r'(\d{4})-(\d{2})-(\d{2})', v)
    return datetime(int(mm[1]), int(mm[2]), int(mm[3])) if mm else None

def s(x): return '' if x is None else str(x)

def load_soldiers(repo):
    sdir = os.path.join(repo, "site", "soldiers")
    out = {}
    for slug in sorted(os.listdir(sdir)):
        f = os.path.join(sdir, slug, f"{slug}.md")
        d = parse_fm(f)
        if not isinstance(d, dict): continue
        sr = d.get("service_record") or {}
        asn = sr.get("assignments") or []
        arr = pdate(d.get("arrived"))
        end = pdate(d.get("departed"))
        inferred = False
        if not end:
            for a in asn:
                t = pdate(a.get("to"))
                if t: end = t; break
        if not end and d.get("status") == "kia" and d.get("year_deceased"):
            # fall back to a timeline combat date if present
            for ev in (d.get("timeline") or []):
                if ev.get("type") == "combat" and pdate(ev.get("date")): end = pdate(ev.get("date")); break
        if not end and arr and d.get("status") != "kia":
            end = arr + timedelta(days=365); inferred = True
        out[slug] = dict(arr=arr, end=end, inferred=inferred,
                         plat=s(d.get("platoon")).strip(), draft=bool(d.get("draft")),
                         status=d.get("status"), title=s(d.get("title")))
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-dir", required=True)
    ap.add_argument("--summary", action="store_true")
    ap.add_argument("--review")
    ap.add_argument("--write", action="store_true")
    args = ap.parse_args()

    exclude_path = os.path.join(args.repo_dir, "site", "_data", "alongside-exclude.json")
    excl = {}
    if os.path.exists(exclude_path):
        ex = json.load(open(exclude_path, encoding="utf-8"))
        for grp in ("attached", "command"):
            for slug, why in (ex.get(grp) or {}).items(): excl[slug] = f"{grp}: {why}"

    sold = load_soldiers(args.repo_dir)
    def windowed(v): return v["arr"] and v["end"]
    elig = {k: v for k, v in sold.items()
            if windowed(v) and not v["draft"] and k not in excl}

    def overlap(a, b): return a["arr"] <= b["end"] and b["arr"] <= a["end"]
    def candidates(slug):
        me = elig.get(slug)
        if not me: return None
        res = []
        for o, v in elig.items():
            if o == slug or not overlap(me, v): continue
            tier = 2 if (me["plat"] and me["plat"] == v["plat"]) else 3
            res.append(dict(slug=o, tier=tier,
                            basis="same-platoon-tour" if tier == 2 else "same-tour",
                            inferred=(me["inferred"] or v["inferred"])))
        return sorted(res, key=lambda r: (r["tier"], r["slug"]))

    if args.summary or (not args.review and not args.write):
        nowin = [k for k, v in sold.items() if not windowed(v) and k not in excl]
        print(f"profiles: {len(sold)}")
        print(f"excluded (attached/command, per alongside-exclude.json): {len(excl)}")
        print(f"eligible (organic, windowed, not draft/excluded): {len(elig)}")
        print(f"  of which use inferred DEROS (arrived+365): {sum(1 for v in elig.values() if v['inferred'])}")
        print(f"no usable tour window (skipped, not auto-linked): {len(nowin)}")
        print("  ", ", ".join(sorted(nowin)[:30]) + (" ..." if len(nowin) > 30 else ""))

    if args.review:
        c = candidates(args.review)
        me = elig.get(args.review)
        if c is None:
            print(f"{args.review}: NOT eligible "
                  f"({'excluded: '+excl[args.review] if args.review in excl else 'no tour window or draft'})")
            return
        win = f"{me['arr'].date()} – {me['end'].date()}" + (" (DEROS inferred)" if me["inferred"] else "")
        print(f"\n=== REVIEW: {args.review}  [{me['title']}]  tour {win}  platoon={me['plat'] or '—'} ===")
        print(f"Would link to {len(c)} men. Inspect for anyone NOT actually D Co (add to alongside-exclude.json):")
        for r in c:
            flag = " ⚠inferred-end" if r["inferred"] else ""
            print(f"  T{r['tier']} {r['slug']:28s} ({r['basis']}){flag}")

    if args.write:
        sdir = os.path.join(args.repo_dir, "site", "soldiers")
        wrote = 0
        for slug in elig:
            cands = candidates(slug) or []
            if not cands: continue
            alf = os.path.join(sdir, slug, "_alongside.json")
            existing = []
            if os.path.exists(alf):
                try: existing = json.load(open(alf, encoding="utf-8"))
                except Exception: existing = []
            have = {e.get("slug") for e in existing if isinstance(e, dict)}
            for r in cands:
                if r["slug"] in have: continue
                note = "Overlapping D Co tour" + (" (end date inferred, ~12-month DEROS)" if r["inferred"] else "")
                existing.append({"slug": r["slug"], "basis": "same-platoon" if r["tier"] == 2 else r["basis"], "notes": note})
            json.dump(existing, open(alf, "w", encoding="utf-8"), indent=2)
            wrote += 1
        print(f"--write: merged overlap links into {wrote} _alongside.json files (existing entries preserved).")

if __name__ == "__main__":
    main()
