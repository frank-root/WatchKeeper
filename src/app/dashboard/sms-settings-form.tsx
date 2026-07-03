"use client";

import { useState } from "react";
import { updateSmsSettings } from "./actions";

export function SmsSettingsForm(props: { phone: string | null; smsOptIn: boolean }) {
  const [optIn, setOptIn] = useState(props.smsOptIn);

  return (
    <form
      action={updateSmsSettings}
      className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5"
    >
      <div>
        <h2 className="font-semibold text-white">Text message reminders</h2>
        <p className="mt-1 text-sm text-slate-400">
          Get the same 90 / 60 / 30-day reminders by SMS, on top of email.
        </p>
      </div>

      <label className="block text-sm text-slate-300">
        Mobile number
        <input
          name="phone"
          type="tel"
          defaultValue={props.phone ?? ""}
          placeholder="(206) 555-0123"
          autoComplete="tel"
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-sky-500"
        />
      </label>

      <label className="flex items-start gap-3 text-sm text-slate-300">
        <input
          name="sms_opt_in"
          type="checkbox"
          checked={optIn}
          onChange={(e) => setOptIn(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-950 accent-sky-600"
        />
        <span>
          Text me when my credentials are about to expire.
          <span className="mt-1 block text-xs text-slate-500">
            By checking this box you agree to receive automated credential-expiration
            reminders from Watchkeeper at the number above. Message and data rates may
            apply. Uncheck anytime to stop.
          </span>
        </span>
      </label>

      <button
        type="submit"
        className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
      >
        Save SMS settings
      </button>
    </form>
  );
}
