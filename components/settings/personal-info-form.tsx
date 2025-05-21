"use client";
import { useState } from "react";
import { InputWithUnit } from "./input-with-unit";
import { SettingCard } from "./setting-card";

interface PersonalInfo {
  weight: string;
  height: string;
  age: string;
  gender: string;
  activity: string;
  goal: string;
}

export function PersonalInfoForm() {
  const [formData, setFormData] = useState<PersonalInfo>({
    weight: "",
    height: "",
    age: "",
    gender: "other",
    activity: "",
    goal: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Personal Info Submitted:", formData);
    // Здесь можно отправить данные на сервер
  };

  return (
    <SettingCard>
      <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputWithUnit
            id="weight"
            label="Weight"
            name="weight"
            value={formData.weight}
            unit="kg"
            placeholder="70"
            onChange={handleChange}
          />
          <InputWithUnit
            id="height"
            label="Height"
            name="height"
            value={formData.height}
            unit="cm"
            placeholder="175"
            onChange={handleChange}
          />
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="30"
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="activity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Activity Level
            </label>
            <select
              id="activity"
              name="activity"
              value={formData.activity}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="sedentary">
                Sedentary (little or no exercise)
              </option>
              <option value="light">
                Lightly active (light exercise 1-3 days/week)
              </option>
              <option value="moderate">
                Moderately active (moderate exercise 3-5 days/week)
              </option>
              <option value="active">
                Active (hard exercise 6-7 days/week)
              </option>
              <option value="very-active">
                Very active (very hard exercise & physical job)
              </option>
            </select>
          </div>
          <div>
            <label
              htmlFor="goal"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Goal
            </label>
            <select
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Gain Muscle</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-orange-200 hover:bg-orange-400 hover:shadow-lg active:shadow-none cursor-pointer text-white rounded-xl hover:bg-opacity-90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </SettingCard>
  );
}
