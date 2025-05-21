// components/settings/telegram-connect.tsx
"use client";

import { useState, useRef } from "react";
import { SettingCard } from "./setting-card";

export function TelegramConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  // Явно типизируем useRef для массива HTMLInputElement | null
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleConnect = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOtp(["", "", "", "", "", ""]);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyUp = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    console.log("Resend OTP");
  };

  const handleVerifyOtp = () => {
    const code = otp.join("");
    if (code.length === 6 && /^\d{6}$/.test(code)) {
      setIsConnected(true);
      setIsModalOpen(false);
      setOtp(["", "", "", "", "", ""]);
      console.log("Verify OTP:", code);
    } else {
      alert("Please enter a valid 6-digit code");
    }
  };

  return (
    <SettingCard>
      <h2 className="text-xl font-semibold mb-6">Connect with Telegram Bot</h2>
      <p className="text-gray-600 mb-6">
        Connect your account with our Telegram bot to receive daily reminders,
        nutrition tips, and track your meals on the go.
      </p>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <svg
            className="w-10 h-10 text-[#0088cc] mr-3"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.691 3.246-1.278 6.009-.26 1.175-.545 2.335-.804 3.437-.362 1.527-.762 2.392-1.166 2.755-.4.36-.75.44-1.032.34-.288-.1-.539-.312-.75-.524-.389-.377-.695-.675-1.232-1.021-.627-.405-1.773-1.193-2.926-2.045-.9-.667-1.939-1.961-.09-3.307l.63-.567c.118-.105 2.277-2.051 2.317-2.093.05-.056.096-.135.054-.21-.042-.075-.125-.09-.19-.09-.104 0-1.832 1.074-5.189 3.222-.493.338-.941.504-1.344.495-.442-.01-1.29-.25-1.92-.456-.777-.256-1.395-.393-1.34-.831.028-.22.356-.447.983-.68 3.43-1.499 5.708-2.484 6.833-2.954 3.19-1.333 3.852-1.565 4.29-1.571.095-.001.308.023.445.138.084.07.15.164.177.273.042.171.028.353.016.529z" />
          </svg>
          <div>
            <h3 className="font-medium">NutriFlow Bot</h3>
            <p className="text-sm text-gray-500">@NutriFlow_Bot</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleConnect}
          className="px-6 py-3 bg-[#0088cc] text-white rounded-xl hover:bg-opacity-90 transition-colors"
        >
          Connect
        </button>
      </div>
      {isConnected && (
        <div>
          <div className="flex items-center text-green-500 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Connected to Telegram</span>
          </div>
          <p className="text-sm text-gray-600">
            You can now receive notifications and track your nutrition through
            our Telegram bot.
          </p>
        </div>
      )}

      {/* Модальное окно OTP */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                Verify Telegram Connection
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Weve sent a 6-digit verification code to your Telegram account.
              Please enter it below to complete the connection.
            </p>
            <div className="flex justify-center space-x-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyUp={(e) => handleKeyUp(index, e)}
                  ref={(el) => {
                    inputRefs.current[index] = el; // Без возврата значения
                  }}
                  className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apricot"
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-apricot hover:text-opacity-80 font-medium"
              >
                Resend Code
              </button>
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="px-6 py-3 bg-apricot text-white rounded-xl hover:bg-opacity-90 transition-colors"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </SettingCard>
  );
}
