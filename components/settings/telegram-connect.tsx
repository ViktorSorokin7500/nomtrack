// components/settings/telegram-connect.tsx
"use client";

import { useState, useRef } from "react";
import { Card } from "../shared";

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
    <Card>
      <h2 className="text-xl font-semibold mb-6">Connect with Telegram Bot</h2>
      <p className="text-gray-600 mb-6">
        Connect your account with our Telegram bot to receive daily reminders,
        nutrition tips, and track your meals on the go.
      </p>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="60"
            height="60"
            viewBox="0 0 48 48"
          >
            <path
              fill="#29b6f6"
              d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"
            ></path>
            <path
              fill="#fff"
              d="M33.95,15l-3.746,19.126c0,0-0.161,0.874-1.245,0.874c-0.576,0-0.873-0.274-0.873-0.274l-8.114-6.733 l-3.97-2.001l-5.095-1.355c0,0-0.907-0.262-0.907-1.012c0-0.625,0.933-0.923,0.933-0.923l21.316-8.468 c-0.001-0.001,0.651-0.235,1.126-0.234C33.667,14,34,14.125,34,14.5C34,14.75,33.95,15,33.95,15z"
            ></path>
            <path
              fill="#b0bec5"
              d="M23,30.505l-3.426,3.374c0,0-0.149,0.115-0.348,0.12c-0.069,0.002-0.143-0.009-0.219-0.043 l0.964-5.965L23,30.505z"
            ></path>
            <path
              fill="#cfd8dc"
              d="M29.897,18.196c-0.169-0.22-0.481-0.26-0.701-0.093L16,26c0,0,2.106,5.892,2.427,6.912 c0.322,1.021,0.58,1.045,0.58,1.045l0.964-5.965l9.832-9.096C30.023,18.729,30.064,18.416,29.897,18.196z"
            ></path>
          </svg>
          <div>
            <h3 className="font-medium">NomTrack Bot</h3>
            <p className="text-sm text-gray-500">@NomTrack_Bot</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleConnect}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 hover:shadow-lg cursor-pointer active:shadow-sm text-white rounded-xl hover:bg-opacity-90 transition-colors"
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
                className="text-gray-400 hover:text-gray-500 cursor-pointer"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-6"
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
                  className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-orange-400 font-medium"
              >
                Resend Code
              </button>
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white cursor-pointer hover:shadow-lg active:shadow-sm active:bg-orange-400 rounded-xl hover:bg-opacity-90 transition-colors"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
