import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a Google Meet link for a meeting
 * @param meetingTitle - The title of the meeting (will be used in the URL)
 * @returns A Google Meet URL
 */
export function generateGoogleMeetLink(meetingTitle: string): string {
  // Create a sanitized version of the meeting title for the URL
  const sanitizedTitle = meetingTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric chars with dashes
    .replace(/^-|-$/g, '')        // Remove leading/trailing dashes
    .substring(0, 30);            // Limit length
    
  // Generate a random code to make the meeting ID unique (3 parts of 3 characters each)
  const randomCode = Math.random().toString(36).substring(2, 11);
  const formattedCode = [
    randomCode.substring(0, 3),
    randomCode.substring(3, 6),
    randomCode.substring(6, 9)
  ].join('-');
  
  // Combine the title and random code to create the meeting ID
  const meetingId = sanitizedTitle ? `${sanitizedTitle}-${formattedCode}` : formattedCode;
  
  return `https://meet.google.com/${meetingId}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function calculateTimeLeft(endDate: Date | string): string {
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  const now = new Date();
  
  const diff = end.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days < 0) return "Expired";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days} days`;
}

export function getRelativeMeetingDate(meetingDate: Date | string): string {
  const date = typeof meetingDate === "string" ? new Date(meetingDate) : meetingDate;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  // Check if the meeting is today
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return "Today";
  }
  
  // Check if the meeting is tomorrow
  if (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  ) {
    return "Tomorrow";
  }
  
  // Otherwise, return the formatted date
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}
