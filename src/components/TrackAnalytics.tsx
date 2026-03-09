"use client";

import { Analytics } from "@vercel/analytics/next";

export function TrackAnalytics() {
    return (
        <Analytics
            beforeSend={(event) => {
                // Chỉ gửi analytics nếu localStorage không có key 'ignore_analytics' = 'true'
                if (
                    globalThis.window !== undefined &&
                    globalThis.window.localStorage.getItem("ignore_analytics") === "true"
                ) {
                    return null; // Huỷ gửi event này
                }
                return event;
            }}
        />
    );
}
