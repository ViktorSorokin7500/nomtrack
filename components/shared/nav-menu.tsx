import React from "react";
import { Dropdown } from "../ui";
import { Coins } from "lucide-react";
import { SHARED_TEXTS } from "./(texts)/shared-text";

export default function NavMenu({ aiCreditsLeft }: { aiCreditsLeft: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 text-sm text-green-600">
        <Coins className="size-5" />
        <strong>{aiCreditsLeft}</strong>
      </div>
      <Dropdown.Menu>
        <Dropdown.Trigger className="cursor-pointer">
          <span className="text-stone-700 hover:text-orange-500">
            {SHARED_TEXTS.NAV_MENU.MENU}{" "}
          </span>
        </Dropdown.Trigger>
        <Dropdown.Content className="scale-115">
          <Dropdown.Item href="/dashboard">
            {SHARED_TEXTS.NAV_MENU.DASHBOARD}
          </Dropdown.Item>
          <Dropdown.Item href="/settings">
            {SHARED_TEXTS.NAV_MENU.SETTINGS}
          </Dropdown.Item>
          <Dropdown.Item href="/archive">
            {SHARED_TEXTS.NAV_MENU.ARCHIVE}{" "}
          </Dropdown.Item>
          <Dropdown.Item href="/recipes">
            {SHARED_TEXTS.NAV_MENU.RECIPES}
          </Dropdown.Item>
          <Dropdown.Item href="/coach">
            {SHARED_TEXTS.NAV_MENU.COACH}
          </Dropdown.Item>
          <Dropdown.Separator />
          <div className="text-sm py-1 px-2">
            <form action="/auth/sign-out" method="POST">
              <button
                className="cursor-pointer hover:text-red-500 transition-colors delay-75"
                type="submit"
              >
                {SHARED_TEXTS.NAV_MENU.SIGN_OUT}
              </button>
            </form>
          </div>
        </Dropdown.Content>
      </Dropdown.Menu>
    </div>
  );
}
