import { useMutation } from "@tanstack/react-query";

export const validatePhoneFormat = (phone: string): { valid: boolean; formatted: string; error?: string } => {
  const cleaned = phone.replace(/[^\d+]/g, "");

  if (!cleaned.match(/^\+?[\d]{7,15}$/)) {
    return { valid: false, formatted: cleaned, error: "Invalid phone number format" };
  }

  const africanPrefixes = [
    "233", "234", "254", "27", "221", "225", "237", "250", "255", "256", "20", "212", "216", "251",
  ];

  const digits = cleaned.replace(/^\+/, "");
  const hasValidPrefix = africanPrefixes.some((p) => digits.startsWith(p));
  const formatted = cleaned.startsWith("+") ? cleaned : `+${cleaned}`;

  return {
    valid: true,
    formatted,
    error: hasValidPrefix ? undefined : "Phone number may not be valid for Africa — check country code",
  };
};

export const useEmailValidation = () => {
  return useMutation({
    mutationFn: async (email: string): Promise<{
      valid: boolean;
      deliverable: boolean;
      isFreeEmail: boolean;
      isDisposable: boolean;
      quality: number;
    }> => {
      const apiKey = import.meta.env.VITE_ABSTRACT_EMAIL_KEY;

      if (!apiKey) {
        const basicValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        return {
          valid: basicValid,
          deliverable: basicValid,
          isFreeEmail: ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"].some((d) =>
            email.toLowerCase().includes(d)
          ),
          isDisposable: false,
          quality: basicValid ? 0.8 : 0,
        };
      }

      const res = await fetch(
        `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`
      );
      if (!res.ok) throw new Error("Email validation failed");
      const data = await res.json();

      return {
        valid: data.is_valid_format?.value || false,
        deliverable: data.deliverability === "DELIVERABLE",
        isFreeEmail: data.is_free_email?.value || false,
        isDisposable: data.is_disposable_email?.value || false,
        quality: data.quality_score || 0,
      };
    },
  });
};

export const sanitizeWhatsAppNumber = (phone: string): string => {
  return phone.replace(/[^\d]/g, "");
};

export const isValidWhatsAppNumber = (phone: string): boolean => {
  const sanitized = sanitizeWhatsAppNumber(phone);
  return sanitized.length >= 7 && sanitized.length <= 15;
};
