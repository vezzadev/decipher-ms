#!/usr/bin/env python3
"""Generate the App Insights dashboard JSON for decipher.ms.

Mirrors the Cloudflare Web Analytics layout against the
`ai-decipherms-wu2-1` Application Insights resource. Re-run after editing,
then PUT with:

    az rest --method put \\
      --url "https://management.azure.com/$(az resource show \\
        --resource-type Microsoft.Portal/dashboards \\
        --name 00575dd1-2f5b-47ad-845d-a706d47fbfe4-dashboard \\
        --resource-group rg-decipherms-wu2-1 \\
        --query id -o tsv)?api-version=2020-09-01-preview" \\
      --body @scripts/dashboard.generated.json
"""

import json
from pathlib import Path

SUB = "240ae4d5-0160-4b5d-b078-e8e3074cecc2"
RG = "rg-decipherms-wu2-1"
APP = "ai-decipherms-wu2-1"
COMPONENT_ID = (
    f"/subscriptions/{SUB}/resourceGroups/{RG}"
    f"/providers/Microsoft.Insights/components/{APP}"
)
DASHBOARD_NAME = "00575dd1-2f5b-47ad-845d-a706d47fbfe4-dashboard"
DASHBOARD_ID = (
    f"/subscriptions/{SUB}/resourceGroups/{RG}"
    f"/providers/Microsoft.Portal/dashboards/{DASHBOARD_NAME}"
)
LOCATION = "westus2"
TIMERANGE = "P7D"

COMPONENT_VALUE = {
    "Name": APP,
    "SubscriptionId": SUB,
    "ResourceGroup": RG,
    "LinkedApplicationType": -1,
    "ResourceId": COMPONENT_ID,
    "ResourceType": "microsoft.insights/components",
    "IsAzureFirst": False,
}


def kql_part(x, y, w, h, title, subtitle, query, chart="Line",
             control="FrameControlChart", split_by=None, x_axis=None,
             y_axis=None, agg="Sum"):
    content = {
        "Query": query,
        "PartTitle": title,
        "PartSubTitle": subtitle,
        "ControlType": control,
    }
    if control == "FrameControlChart":
        content["SpecificChart"] = chart
        dims = {}
        if x_axis:
            dims["xAxis"] = x_axis
        if y_axis:
            dims["yAxis"] = y_axis
        dims["splitBy"] = split_by or []
        dims["aggregation"] = agg
        content["Dimensions"] = dims
    return {
        "position": {"x": x, "y": y, "colSpan": w, "rowSpan": h},
        "metadata": {
            "inputs": [
                {"name": "resourceTypeMode", "isOptional": True},
                {"name": "ComponentId", "value": COMPONENT_VALUE},
                {"name": "Scope", "value": {"resourceIds": [COMPONENT_ID]},
                 "isOptional": True},
                {"name": "PartId", "isOptional": True},
                {"name": "Version", "value": "2.0"},
                {"name": "TimeRange", "value": TIMERANGE, "isOptional": True},
                {"name": "DashboardId", "isOptional": True},
                {"name": "DraftRequestParameters", "isOptional": True},
                {"name": "Query", "value": query, "isOptional": True},
                {"name": "ControlType", "value": control, "isOptional": True},
                {"name": "SpecificChart", "value": chart, "isOptional": True},
                {"name": "PartTitle", "value": title, "isOptional": True},
                {"name": "PartSubTitle", "value": subtitle, "isOptional": True},
                {"name": "Dimensions", "value": content.get("Dimensions"),
                 "isOptional": True},
                {"name": "LegendOptions", "isOptional": True},
                {"name": "IsQueryContainTimeRange", "value": False,
                 "isOptional": True},
            ],
            "type": ("Extension/Microsoft_OperationsManagementSuite_Workspace"
                     "/PartType/LogsDashboardPart"),
            "settings": {"content": content},
            "asset": {"idInputName": "ComponentId", "type": "ApplicationInsights"},
        },
    }


def markdown_part(x, y, w, h, title, content):
    return {
        "position": {"x": x, "y": y, "colSpan": w, "rowSpan": h},
        "metadata": {
            "inputs": [],
            "type": "Extension/HubsExtension/PartType/MarkdownPart",
            "settings": {"content": {"settings": {
                "content": content,
                "title": title,
                "subtitle": "",
                "markdownSource": 1,
            }}},
        },
    }


# ─── KQL queries ────────────────────────────────────────────────────────────

Q_PAGEVIEWS = """pageViews
| where timestamp > ago(7d)
| summarize Views = count() by bin(timestamp, 1h)
| render timechart"""

Q_VISITS = """pageViews
| where timestamp > ago(7d)
| summarize Visits = dcount(session_Id) by bin(timestamp, 1h)
| render timechart"""

Q_PAGELOAD = """pageViews
| where timestamp > ago(7d)
| summarize ['Page load p75 (ms)'] = percentile(duration, 75) by bin(timestamp, 1h)
| render timechart"""

Q_TOP_PAGES = """pageViews
| where timestamp > ago(7d)
| extend path = tostring(parse_url(url).Path)
| summarize Views = count(), Visitors = dcount(session_Id) by path
| top 15 by Views desc"""

Q_COUNTRIES = """pageViews
| where timestamp > ago(7d)
| where isnotempty(client_CountryOrRegion)
| summarize Views = count() by client_CountryOrRegion
| top 15 by Views desc"""

Q_BROWSERS = """pageViews
| where timestamp > ago(7d)
| where isnotempty(client_Browser)
| summarize Views = count() by client_Browser
| top 10 by Views desc"""

Q_OS = """pageViews
| where timestamp > ago(7d)
| where isnotempty(client_OS)
| summarize Views = count() by client_OS
| top 10 by Views desc"""

Q_REFERRERS = """customEvents
| where timestamp > ago(7d)
| extend ref = tostring(customDimensions.referrer)
| where isnotempty(ref)
| summarize Hits = count() by ref
| top 10 by Hits desc"""

Q_VITALS_TIMING_P75 = """customMetrics
| where timestamp > ago(7d)
| where name in ('LCP','INP','FCP','TTFB')
| summarize P75_ms = percentile(value, 75) by bin(timestamp, 1h), name
| render timechart"""

Q_CLS_P75 = """customMetrics
| where timestamp > ago(7d)
| where name == 'CLS'
| summarize ['CLS p75'] = percentile(value, 75) by bin(timestamp, 1h)
| render timechart"""

def q_rating(metric):
    return f"""customMetrics
| where timestamp > ago(7d)
| where name == '{metric}'
| extend rating = tostring(customDimensions.rating)
| summarize Count = count() by rating
| render piechart"""

def q_rating_timeseries(metric):
    return f"""customMetrics
| where timestamp > ago(7d)
| where name == '{metric}'
| extend rating = tostring(customDimensions.rating)
| summarize Count = count() by bin(timestamp, 1h), rating
| render columnchart with (kind=stacked)"""

# Generic drilldown: top N values of a dimension with samples, p75, %poor.
def q_breakdown(metric, dim_expr, label):
    return f"""customMetrics
| where timestamp > ago(7d)
| where name == '{metric}'
| extend dim = {dim_expr}, rating = tostring(customDimensions.rating)
| where isnotempty(dim)
| summarize Samples = count(),
            P75 = round(percentile(value, 75), 2),
            ['% Poor'] = round(100.0 * countif(rating == 'poor') / count(), 1),
            ['% NI'] = round(100.0 * countif(rating == 'needs-improvement') / count(), 1)
            by ['{label}'] = dim
| top 10 by Samples desc"""

Q_EXCEPTIONS = """exceptions
| where timestamp > ago(7d)
| summarize Count = count() by bin(timestamp, 1h), type
| render timechart"""

Q_EXCEPTIONS_TOP = """exceptions
| where timestamp > ago(7d)
| summarize Count = count() by type, outerMessage
| top 10 by Count desc"""


# ─── Layout ─────────────────────────────────────────────────────────────────

parts = []

parts.append(markdown_part(
    0, 0, 12, 1,
    "decipher.ms — Web Analytics",
    "## decipher.ms — Web Analytics\n"
    "Cloudflare-style RUM, sourced from Application Insights "
    "`ai-decipherms-wu2-1`. Web Vitals come from the browser `web-vitals` "
    "library (attribution build); client IP / country / browser / OS are "
    "enriched server-side by App Insights ingestion. Default window: 7d.",
))

# KPI strip
parts.append(kql_part(0, 1, 4, 3, "Page views", "Hourly, last 7d",
                     Q_PAGEVIEWS, chart="Area",
                     x_axis={"name": "timestamp", "type": "datetime"},
                     y_axis=[{"name": "Views", "type": "long"}]))
parts.append(kql_part(4, 1, 4, 3, "Visits", "dcount(session_Id), hourly",
                     Q_VISITS, chart="Area",
                     x_axis={"name": "timestamp", "type": "datetime"},
                     y_axis=[{"name": "Visits", "type": "long"}]))
parts.append(kql_part(8, 1, 4, 3, "Page load (p75)",
                     "PageView duration p75, ms",
                     Q_PAGELOAD, chart="Line",
                     x_axis={"name": "timestamp", "type": "datetime"},
                     y_axis=[{"name": "Page load p75 (ms)", "type": "real"}]))

# Top pages / countries
parts.append(kql_part(0, 4, 6, 4, "Top pages", "by views, last 7d",
                     Q_TOP_PAGES, control="AnalyticsGrid"))
parts.append(kql_part(6, 4, 6, 4, "Countries", "by views, last 7d",
                     Q_COUNTRIES, control="AnalyticsGrid"))

# Browsers / OS / referrers
parts.append(kql_part(0, 8, 4, 3, "Browsers", "last 7d",
                     Q_BROWSERS, chart="Pie",
                     x_axis={"name": "client_Browser", "type": "string"},
                     y_axis=[{"name": "Views", "type": "long"}]))
parts.append(kql_part(4, 8, 4, 3, "Operating system", "last 7d",
                     Q_OS, chart="Pie",
                     x_axis={"name": "client_OS", "type": "string"},
                     y_axis=[{"name": "Views", "type": "long"}]))
parts.append(kql_part(8, 8, 4, 3, "Top referrers", "external origins, last 7d",
                     Q_REFERRERS, control="AnalyticsGrid"))

# Core Web Vitals
parts.append(markdown_part(
    0, 11, 12, 1,
    "Core Web Vitals",
    "## Core Web Vitals\n"
    "Each metric: rating split (good / needs-improvement / poor) over time, "
    "plus drilldowns by URL / Browser / OS / Country / Element "
    "(Element = CSS selector of LCP target, largest CLS shift source, "
    "or INP interaction target).",
))

parts.append(kql_part(0, 12, 8, 4,
                     "LCP / INP / FCP / TTFB p75",
                     "milliseconds, hourly, last 7d",
                     Q_VITALS_TIMING_P75, chart="Line",
                     x_axis={"name": "timestamp", "type": "datetime"},
                     y_axis=[{"name": "P75_ms", "type": "real"}],
                     split_by=[{"name": "name", "type": "string"}]))
parts.append(kql_part(8, 12, 4, 4,
                     "CLS p75", "score, hourly, last 7d",
                     Q_CLS_P75, chart="Line",
                     x_axis={"name": "timestamp", "type": "datetime"},
                     y_axis=[{"name": "CLS p75", "type": "real"}]))


def vital_block(y_base, metric, *, with_element):
    """Two rows (rating + drilldown) per metric. 4 rows tall each."""
    out = []
    # Row A: rating pie / rating-over-time / element grid
    out.append(kql_part(0, y_base, 3, 4,
                        f"{metric} — rating split",
                        "good / needs-improvement / poor",
                        q_rating(metric), chart="Pie",
                        x_axis={"name": "rating", "type": "string"},
                        y_axis=[{"name": "Count", "type": "long"}]))
    out.append(kql_part(3, y_base, 5, 4,
                        f"{metric} — rating over time",
                        "stacked, last 7d",
                        q_rating_timeseries(metric), chart="StackedColumn",
                        x_axis={"name": "timestamp", "type": "datetime"},
                        y_axis=[{"name": "Count", "type": "long"}],
                        split_by=[{"name": "rating", "type": "string"}]))
    if with_element:
        out.append(kql_part(8, y_base, 4, 4,
                            f"{metric} — top offending elements",
                            "by sample count",
                            q_breakdown(metric,
                                        "tostring(customDimensions.element)",
                                        "Element"),
                            control="AnalyticsGrid"))
    # Row B: by URL / Browser / OS / Country
    y2 = y_base + 4
    out.append(kql_part(0, y2, 3, 4, f"{metric} — by URL", "top 10",
                        q_breakdown(metric, "tostring(customDimensions.path)",
                                    "URL"),
                        control="AnalyticsGrid"))
    out.append(kql_part(3, y2, 3, 4, f"{metric} — by Browser", "top 10",
                        q_breakdown(metric, "client_Browser", "Browser"),
                        control="AnalyticsGrid"))
    out.append(kql_part(6, y2, 3, 4, f"{metric} — by OS", "top 10",
                        q_breakdown(metric, "client_OS", "OS"),
                        control="AnalyticsGrid"))
    out.append(kql_part(9, y2, 3, 4, f"{metric} — by Country", "top 10",
                        q_breakdown(metric, "client_CountryOrRegion",
                                    "Country"),
                        control="AnalyticsGrid"))
    return out


# y=16-23: LCP, y=24-31: INP, y=32-39: CLS, y=40-43: FCP, y=44-47: TTFB
parts.extend(vital_block(16, "LCP", with_element=True))
parts.extend(vital_block(24, "INP", with_element=True))
parts.extend(vital_block(32, "CLS", with_element=True))

# FCP / TTFB get drilldown rows only (no element attribution).
def timing_block(y_base, metric):
    out = []
    out.append(kql_part(0, y_base, 3, 4, f"{metric} — by URL", "top 10",
                        q_breakdown(metric, "tostring(customDimensions.path)",
                                    "URL"),
                        control="AnalyticsGrid"))
    out.append(kql_part(3, y_base, 3, 4, f"{metric} — by Browser", "top 10",
                        q_breakdown(metric, "client_Browser", "Browser"),
                        control="AnalyticsGrid"))
    out.append(kql_part(6, y_base, 3, 4, f"{metric} — by OS", "top 10",
                        q_breakdown(metric, "client_OS", "OS"),
                        control="AnalyticsGrid"))
    out.append(kql_part(9, y_base, 3, 4, f"{metric} — by Country", "top 10",
                        q_breakdown(metric, "client_CountryOrRegion",
                                    "Country"),
                        control="AnalyticsGrid"))
    return out

parts.append(markdown_part(0, 40, 12, 1, "FCP", "## FCP — First Contentful Paint"))
parts.extend(timing_block(41, "FCP"))
parts.append(markdown_part(0, 45, 12, 1, "TTFB", "## TTFB — Time to First Byte"))
parts.extend(timing_block(46, "TTFB"))

# Errors
parts.append(markdown_part(0, 50, 12, 1, "Errors", "## JavaScript exceptions"))
parts.append(kql_part(0, 51, 8, 4, "Exceptions over time", "by type, last 7d",
                     Q_EXCEPTIONS, chart="Line",
                     x_axis={"name": "timestamp", "type": "datetime"},
                     y_axis=[{"name": "Count", "type": "long"}],
                     split_by=[{"name": "type", "type": "string"}]))
parts.append(kql_part(8, 51, 4, 4, "Top exceptions", "by count, last 7d",
                     Q_EXCEPTIONS_TOP, control="AnalyticsGrid"))


dashboard = {
    "id": DASHBOARD_ID,
    "location": LOCATION,
    "name": DASHBOARD_NAME,
    "properties": {
        "lenses": [{"order": 0, "parts": parts}],
        "metadata": {
            "model": {
                "timeRange": {
                    "value": {"relative": {"duration": 24, "timeUnit": 1}},
                    "type": "MsPortalFx.Composition.Configuration.ValueTypes.TimeRange",
                },
                "filterLocale": {"value": "en-us"},
                "filters": {"value": {"MsPortalFx_TimeRange": {
                    "model": {"format": "utc", "granularity": "auto",
                              "relative": "7d"},
                    "displayCache": {"name": "UTC Time",
                                     "value": "Past 7 days"},
                    "filteredPartIds": [],
                }}},
            }
        },
    },
    "tags": {"hidden-title": "decipher.ms Web Analytics"},
    "type": "Microsoft.Portal/dashboards",
}

out = Path(__file__).resolve().parent / "dashboard.generated.json"
out.write_text(json.dumps(dashboard, indent=2))
print(f"wrote {out} ({out.stat().st_size} bytes, {len(parts)} parts)")
