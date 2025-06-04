"use client";
import { useState, useCallback } from "react";
import { InputWithUnit } from "./input-with-unit";
import { Card } from "../shared";

interface PersonalInfo {
  weight: number | string;
  height: number | string;
  age: number | string;
  gender: string;
  activity: string;
  goal: string;
}

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const ACTIVITY_OPTIONS = [
  { value: "sedentary", label: "Sedentary (little or no exercise)" },
  { value: "light", label: "Lightly active (light exercise 1-3 days/week)" },
  {
    value: "moderate",
    label: "Moderately active (moderate exercise 3-5 days/week)",
  },
  { value: "active", label: "Active (hard exercise 6-7 days/week)" },
  {
    value: "very-active",
    label: "Very active (very hard exercise & physical job)",
  },
];

const GOAL_OPTIONS = [
  { value: "lose", label: "Lose Weight" },
  { value: "maintain", label: "Maintain Weight" },
  { value: "gain", label: "Gain Muscle" },
];

interface SelectWithLabelProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

function SelectWithLabel({
  id,
  label,
  name,
  value,
  onChange,
  options,
}: SelectWithLabelProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: ["weight", "height", "age"].includes(name)
          ? Number(value) || ""
          : value,
      }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.weight || !formData.height || !formData.age) {
      alert("Please fill in all required fields.");
      return;
    }

    if (
      Number(formData.age) <= 0 ||
      Number(formData.weight) <= 0 ||
      Number(formData.height) <= 0
    ) {
      alert("Weight, height, and age must be positive numbers.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Пример отправки данных
      await fetch("/api/personal-info", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      console.log("Personal Info Submitted:", formData);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
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
            required
            aria-describedby="weight-unit"
          />
          <span id="weight-unit" className="sr-only">
            Weight in kilograms
          </span>
          <InputWithUnit
            id="height"
            label="Height"
            name="height"
            value={formData.height}
            unit="cm"
            placeholder="175"
            onChange={handleChange}
            required
            aria-describedby="height-unit"
          />
          <span id="height-unit" className="sr-only">
            Height in centimeters
          </span>
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
              required
            />
          </div>
          <SelectWithLabel
            id="gender"
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={GENDER_OPTIONS}
          />
          <SelectWithLabel
            id="activity"
            label="Activity Level"
            name="activity"
            value={formData.activity}
            onChange={handleChange}
            options={ACTIVITY_OPTIONS}
          />
          <SelectWithLabel
            id="goal"
            label="Goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            options={GOAL_OPTIONS}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 bg-orange-200 hover:bg-orange-400 hover:shadow-lg active:shadow-none cursor-pointer text-white rounded-xl hover:bg-opacity-90 transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Card>
  );
}
