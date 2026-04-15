"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    roll_no: "",
    type_of_complaint: "",
    description: "",
    location: "",
    date: "",
    time: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const response = await fetch("https://campus-network-complaint-system-1.onrender.com/api/complaints", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        alert("Complaint submitted successfully!");
        
        // Reset form
        setFormData({
          first_name: "", last_name: "", email: "", roll_no: "",
          type_of_complaint: "", description: "", location: "",
          date: "", time: "", image: ""
        });
      } else {
        setError(data.error || data.detail || "Failed to submit complaint");
        alert("❌ " + (data.error || data.detail || "Failed to submit complaint"));
      }
    } catch (err) {
      console.error(err);
      setError("Could not connect to server");
      alert("❌ Could not connect to server. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 text-center">
        Campus Network Complaint Form
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 text-center">
        Report your WiFi / Internet issue
      </p>

      {success && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg text-center">
          Complaint submitted successfully!
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-center">
          {error}
        </div>
      )}

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="first_name">First name</Label>
            <Input id="first_name" placeholder="Tyler" type="text" value={formData.first_name} onChange={handleChange} required />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="last_name">Last name</Label>
            <Input id="last_name" placeholder="Durden" type="text" value={formData.last_name} onChange={handleChange} required />
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="your.email@college.edu" type="email" value={formData.email} onChange={handleChange} required />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="roll_no">Roll Number</Label>
          <Input id="roll_no" placeholder="23DCS024" type="text" value={formData.roll_no} onChange={handleChange} required />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="type_of_complaint">Type of Complaint</Label>
          <Input id="type_of_complaint" placeholder="No Internet / Slow Speed / Router Issue" type="text" value={formData.type_of_complaint} onChange={handleChange} required />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            placeholder="Describe your issue in detail..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className={cn(
              "flex w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm",
              "dark:border-neutral-800 dark:bg-neutral-950",
              "focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600",
              "placeholder:text-neutral-400"
            )}
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="Hostel Block A - Room 305" type="text" value={formData.location} onChange={handleChange} required />
        </LabelInputContainer>

        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={formData.date} onChange={handleChange} required />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="time">Time</Label>
            <Input id="time" type="time" value={formData.time} onChange={handleChange} required />
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-6">
          <Label htmlFor="image">Upload Image (Optional)</Label>
          <Input id="image" type="file" accept="image/*" onChange={(e) => {
            if (e.target.files?.[0]) {
              setFormData(prev => ({ ...prev, image: e.target.files![0].name }));
            }
          }} />
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 disabled:opacity-70"
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting Complaint..." : "Submit Complaint →"}
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};