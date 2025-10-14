import React from "react";
import { Card } from "../shared";
import { SETTINGS_TEXTS } from "./settings-text";

export function SettingsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{SETTINGS_TEXTS.PAGE.TITLE}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <div className="h-[352px]" />
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <div className="h-[530px]" />
          </Card>
          <Card>
            <div className="h-[490px]" />
          </Card>
        </div>
      </div>
    </div>
  );
}
