import React, { useState } from 'react';
import { AnimatePresence, motion, type Transition } from 'framer-motion';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  GraduationCap, 
  Trophy, 
  CreditCard, 
  CheckCircle,
  Shield,
  FileText,
  Upload,
  Copy,
  Check,
  Building,
  Phone,
  Mail,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Instagram,
  X
} from 'lucide-react';

export interface MembershipFormData {
  // Personal & Academic
  englishName: string;
  chineseName: string;
  gender: string;
  uid: string;
  phone: string;
  curriculum: string;
  curriculumOther: string;
  year: string;
  yearOther: string;
  hkuEmail: string;
  
  // Events & Committees
  curricularEvents: string[];
  committees: string[];
  
  // Payment & Terms
  depositSlipName: string;
  depositSlipDataUrl: string;
  agreedToTerms: boolean;
  
  // Completion
  completed: boolean;
}

export interface OnboardingWizardProps {
  onComplete?: (data: MembershipFormData) => void;
  initialData?: Partial<MembershipFormData>;
  className?: string;
}

export default function OnboardingWizard({
  onComplete,
  initialData,
  className = ""
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [copiedBank, setCopiedBank] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const [animationDirection, setAnimationDirection] = useState<"forward" | "backward">("forward");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<MembershipFormData>({
    englishName: initialData?.englishName || "",
    chineseName: initialData?.chineseName || "",
    gender: initialData?.gender || "",
    uid: initialData?.uid || "",
    phone: initialData?.phone || "",
    curriculum: initialData?.curriculum || "",
    curriculumOther: initialData?.curriculumOther || "",
    year: initialData?.year || "",
    yearOther: initialData?.yearOther || "",
    hkuEmail: initialData?.hkuEmail || "",
    curricularEvents: initialData?.curricularEvents || [],
    committees: initialData?.committees || [],
    depositSlipName: initialData?.depositSlipName || "",
    depositSlipDataUrl: initialData?.depositSlipDataUrl || "",
    agreedToTerms: initialData?.agreedToTerms || false,
    completed: initialData?.completed || false
  });

  const steps = [
    {
      id: "constitution",
      title: "Member constitution",
      icon: Shield,
      description: "Privileges & responsibilities"
    },
    {
      id: "profile",
      title: "Student Profile",
      icon: GraduationCap,
      description: "Academic & personal details"
    },
    {
      id: "activities",
      title: "Events & Committees",
      icon: Trophy,
      description: "Sports & organizing functions"
    },
    {
      id: "payment",
      title: "Fee & Verification",
      icon: CreditCard,
      description: "Bank transfer & consent"
    },
    {
      id: "summary",
      title: "Completed",
      icon: CheckCircle,
      description: "Membership confirmed"
    }
  ];

  const curriculumOptions = [
    "BEng (for senior entry students)",
    "BEng X + MscEng AIE",
    "BEng(CE/EE/ElecE)",
    "BEng(CivE)",
    "BEng(DASE)",
    "BEng(Elite)",
    "BEng(ME)",
    "GEBP",
    "Other"
  ];

  const genderOptions = [
    "Female",
    "Male",
    "Prefer not to say"
  ];

  const yearOptions = ["1", "2", "3", "4", "Other"];

  const curricularEventsOptions = [
    { id: "Athletics", label: "Athletics", tag: "Track & Field" },
    { id: "Aquatics", label: "Aquatics", tag: "Swimming & Water Sports" },
    { id: "Soccer", label: "Soccer", tag: "Football League" },
    { id: "Basketball", label: "Basketball", tag: "Court Tournaments" },
    { id: "Badminton", label: "Badminton", tag: "Racket Sports" },
    { id: "Volleyball", label: "Volleyball", tag: "Team Volleyball" },
    { id: "Table Tennis", label: "Table Tennis", tag: "Indoor Matches" }
  ];

  const committeeOptions = [
    {
      id: "Engin' Nite Organising Committee",
      title: "Engin' Nite Organising Committee",
      desc: "Lead annual flagship social and gala gathering for engineering students."
    },
    {
      id: "Welfare Week Organising Committee",
      title: "Welfare Week Organising Committee",
      desc: "Distribute society gifts, curate student welfare packages, and organize fairs."
    },
    {
      id: "Rotor Editorial Board (REB)",
      title: "Rotor Editorial Board (REB)",
      desc: "Produce the prestigious society magazine, articles, and student publications."
    },
    {
      id: "University and Current Affairs Committee (UCAC)",
      title: "University and Current Affairs Committee (UCAC)",
      desc: "Coordinate student representations, forum discussions, and institutional affairs."
    }
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxToggle = (
    category: "curricularEvents" | "committees",
    item: string
  ) => {
    setFormData((prev) => {
      const exists = prev[category].includes(item);
      const updated = exists
        ? prev[category].filter((x) => x !== item)
        : [...prev[category], item];
      return { ...prev, [category]: updated };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          depositSlip: "File size exceeds 8MB. Please choose a smaller image."
        }));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          depositSlipName: file.name,
          depositSlipDataUrl: reader.result as string
        }));
        setErrors((prev) => ({ ...prev, depositSlip: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFileUpload = () => {
    setFormData((prev) => ({
      ...prev,
      depositSlipName: "",
      depositSlipDataUrl: ""
    }));
  };

  const copyBankDetails = () => {
    navigator.clipboard?.writeText("178-790903-838");
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepIndex === 0) {
      // Charter acknowledgment is informational, ready to continue
    } else if (stepIndex === 1) {
      // Profile validation
      if (!formData.englishName.trim()) {
        newErrors.englishName = "English full name is required";
      }
      if (!formData.gender) {
        newErrors.gender = "Please select your gender";
      }
      
      const trimmedUid = formData.uid.trim();
      if (!trimmedUid) {
        newErrors.uid = "UID is required";
      } else if (!/^303\d{7}$/.test(trimmedUid)) {
        newErrors.uid = "UID must be 10 digits starting with 303 (e.g. 3031234567)";
      }

      if (!formData.curriculum) {
        newErrors.curriculum = "Please select your curriculum";
      } else if (formData.curriculum === "Other" && !formData.curriculumOther.trim()) {
        newErrors.curriculumOther = "Please specify your curriculum";
      }

      if (!formData.year) {
        newErrors.year = "Please select your study year";
      } else if (formData.year === "Other" && !formData.yearOther.trim()) {
        newErrors.yearOther = "Please specify your year";
      }

      const trimmedEmail = formData.hkuEmail.trim();
      if (!trimmedEmail) {
        newErrors.hkuEmail = "HKU email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        newErrors.hkuEmail = "Please enter a valid email address";
      } else if (!trimmedEmail.endsWith("@connect.hku.hk") && !trimmedEmail.endsWith("@hku.hk")) {
        newErrors.hkuEmail = "Please provide an HKU email (e.g. @connect.hku.hk)";
      }
    } else if (stepIndex === 2) {
      // Events and committees are optional preferences
    } else if (stepIndex === 3) {
      if (!formData.depositSlipName) {
        newErrors.depositSlip = "Please upload your bank deposit slip as proof of payment";
      }
      if (!formData.agreedToTerms) {
        newErrors.agreedToTerms = "You must agree to the terms and data privacy conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    setAnimationDirection("forward");
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }

    if (currentStep === steps.length - 2) {
      const finalData = { ...formData, completed: true };
      setFormData(finalData);
      setSubmittedSuccess(true);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(`hku_engsoc_reg_${finalData.uid}`, JSON.stringify(finalData));
          localStorage.setItem('hku_engsoc_latest_reg', JSON.stringify(finalData));
        }
      } catch (err) {
        console.warn("Storage warning:", err);
      }
      if (onComplete) {
        onComplete(finalData);
      }
    }
  };

  const handlePrevious = () => {
    setAnimationDirection("backward");
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const pageVariants = {
    initial: (direction: string) => ({
      x: direction === "forward" ? "100%" : "-100%",
      opacity: 0
    }),
    in: {
      x: 0,
      opacity: 1
    },
    out: (direction: string) => ({
      x: direction === "forward" ? "-100%" : "100%",
      opacity: 0
    })
  };

  const pageTransition: Transition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  return (
    <div className={`w-full text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center font-sans ${className}`}>
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/90 dark:border-slate-800 overflow-hidden transition-all">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 text-white px-6 sm:px-10 pt-8 pb-6 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                HKU Engineering Society
              </div>
              <span className="text-xs font-medium text-blue-100 bg-white/10 px-3 py-1 rounded-full">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Engineering Society Membership Form
            </h1>
            <p className="text-blue-100/90 text-xs sm:text-sm mt-1 max-w-2xl">
              Official membership registration and society affiliation for the Engineering Society, HKUSU.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="mt-6 pt-2">
            <div className="overflow-hidden h-2 mb-5 rounded-full bg-blue-950/40">
              <div 
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-500 ease-out rounded-full"
              />
            </div>
            
            <div className="grid grid-cols-5 gap-1 sm:gap-2">
              {steps.map((step, idx) => {
                const IconComponent = step.icon;
                const isPast = idx < currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div key={step.id} className="flex flex-col items-center text-center">
                    <div 
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                        isPast
                          ? 'bg-emerald-400 text-slate-900 font-bold shadow-md'
                          : isCurrent
                          ? 'bg-white text-indigo-700 font-bold ring-4 ring-white/30 shadow-lg scale-105'
                          : 'bg-white/15 text-blue-200'
                      }`}
                    >
                      {isPast ? <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" /> : <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-medium mt-1.5 truncate max-w-full ${
                      isCurrent ? 'text-white font-bold' : isPast ? 'text-blue-100' : 'text-blue-300/70'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Form Step Body */}
        <div className="p-6 sm:p-10">
          <AnimatePresence initial={false} custom={animationDirection} mode="wait">
            <motion.div
              key={currentStep}
              custom={animationDirection}
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={pageTransition}
              className="min-h-[360px]"
            >
              
              {/* STEP 1: Member constitution */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                      Member constitution
                    </h2>
                  </div>

                  {/* Raw Text Constitution */}
                  <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed space-y-4 py-2 font-normal">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      All ordinary members are entitled to the following privileges:
                    </p>
                    <div className="space-y-2.5 pl-1">
                      <p>(1) To use facilities provided by the Society for the general use of its members.</p>
                      <p>(2) To attend functions and activities arranged by the Society.</p>
                      <p>(3) To move and second motions, and to vote at General Meetings and General Polling of the Society.</p>
                      <p>(4) To nominate and be nominated for elections in Society Elections.</p>
                    </div>

                    <div className="pt-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        All ordinary members shall have the following responsibilities:
                      </p>
                      <div className="space-y-2.5 pl-1 mt-3">
                        <p>(1) To attend Annual General Meeting and vote in General Polling.</p>
                        <p>(2) To pay the prescribed membership fees as stated in Section 10 article 10.3.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Student Profile */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                      Student Profile
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Provide your official student registration information as recognized by HKU.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* English Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                        English Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="englishName"
                        value={formData.englishName}
                        onChange={handleInputChange}
                        placeholder="e.g. CHAN Tai Man"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 transition-colors ${
                          errors.englishName ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-slate-700'
                        }`}
                      />
                      {errors.englishName && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.englishName}
                        </p>
                      )}
                    </div>

                    {/* Chinese Full Name (if any) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                        Chinese Full Name <span className="text-slate-400 font-normal">(if any)</span>
                      </label>
                      <input
                        type="text"
                        name="chineseName"
                        value={formData.chineseName}
                        onChange={handleInputChange}
                        placeholder="e.g. 陳大文"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                      />
                    </div>

                    {/* Gender Dropdown (Alphabetical: Female, Male, Prefer not to say) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 transition-colors ${
                          errors.gender ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        <option value="">Select Gender...</option>
                        {genderOptions.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                      {errors.gender && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.gender}
                        </p>
                      )}
                    </div>

                    {/* UID */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                        UID (10-digits, 303XXXXXX) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="uid"
                        maxLength={10}
                        value={formData.uid}
                        onChange={handleInputChange}
                        placeholder="303XXXXXXX"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 font-mono transition-colors ${
                          errors.uid ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-slate-700'
                        }`}
                      />
                      {errors.uid ? (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.uid}
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400 mt-1">Must be 10 digits starting with 303</p>
                      )}
                    </div>

                    {/* Curriculum Dropdown (Alphabetical) */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                        Curriculum <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="curriculum"
                        value={formData.curriculum}
                        onChange={handleInputChange}
                        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 transition-colors ${
                          errors.curriculum ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        <option value="">Select Curriculum...</option>
                        {curriculumOptions.map((curr) => (
                          <option key={curr} value={curr}>
                            {curr}
                          </option>
                        ))}
                      </select>

                      {formData.curriculum === "Other" && (
                        <div className="mt-2.5">
                          <input
                            type="text"
                            name="curriculumOther"
                            value={formData.curriculumOther}
                            onChange={handleInputChange}
                            placeholder="Please specify your curriculum..."
                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50/30 dark:bg-indigo-950/20"
                          />
                          {errors.curriculumOther && (
                            <p className="text-xs text-red-500 mt-1">{errors.curriculumOther}</p>
                          )}
                        </div>
                      )}

                      {errors.curriculum && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.curriculum}
                        </p>
                      )}
                    </div>

                    {/* Year of Study Dropdown (Alphabetical / 1, 2, 3, 4, Other) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                        Year of Study <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 transition-colors ${
                          errors.year ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        <option value="">Select Year of Study...</option>
                        {yearOptions.map((yr) => (
                          <option key={yr} value={yr}>
                            {yr === "Other" ? "Other" : `Year ${yr}`}
                          </option>
                        ))}
                      </select>

                      {formData.year === "Other" && (
                        <div className="mt-2.5">
                          <input
                            type="text"
                            name="yearOther"
                            value={formData.yearOther}
                            onChange={handleInputChange}
                            placeholder="Please specify your year..."
                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50/30 dark:bg-indigo-950/20"
                          />
                          {errors.yearOther && (
                            <p className="text-xs text-red-500 mt-1">{errors.yearOther}</p>
                          )}
                        </div>
                      )}

                      {errors.year && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.year}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 9123 4567"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                      />
                    </div>

                    {/* HKU Email */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                        HKU Email (e.g. xxxxxxx@connect.hku.hk) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="hkuEmail"
                          value={formData.hkuEmail}
                          onChange={handleInputChange}
                          placeholder="uid@connect.hku.hk"
                          className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 transition-colors ${
                            errors.hkuEmail ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300 dark:border-slate-700'
                          }`}
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      </div>
                      {errors.hkuEmail && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.hkuEmail}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Curricular Events & Committees Interested */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                      Society Events & Committee Engagement
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Select any sports teams and organizing committees you would like to participate in.
                    </p>
                  </div>

                  {/* Sports Events Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        Curricular Events (Sports)
                      </label>
                      <span className="text-xs text-slate-400">Multiple selection allowed</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {curricularEventsOptions.map((sport) => {
                        const isSelected = formData.curricularEvents.includes(sport.id);
                        return (
                          <div
                            key={sport.id}
                            onClick={() => handleCheckboxToggle("curricularEvents", sport.id)}
                            className={`p-3.5 rounded-2xl border cursor-pointer select-none transition-all ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50/90 dark:border-indigo-500 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-xs'
                                : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-xs sm:text-sm">{sport.label}</span>
                              <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                                isSelected 
                                  ? 'bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-500' 
                                  : 'border-slate-300 dark:border-slate-600'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{sport.tag}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Committees Interested */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Building className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        Committee(s) and Function(s) Interested
                      </label>
                      <span className="text-xs text-slate-400">Pick any functions</span>
                    </div>

                    <div className="space-y-3">
                      {committeeOptions.map((comm) => {
                        const isSelected = formData.committees.includes(comm.id);
                        return (
                          <div
                            key={comm.id}
                            onClick={() => handleCheckboxToggle("committees", comm.id)}
                            className={`p-4 rounded-2xl border cursor-pointer select-none transition-all flex items-start gap-3.5 ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50/80 dark:border-indigo-500 dark:bg-indigo-950/30'
                                : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center border shrink-0 ${
                              isSelected 
                                ? 'bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-500' 
                                : 'border-slate-300 dark:border-slate-600'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div>
                              <h4 className={`text-sm font-semibold ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-900 dark:text-slate-100'}`}>
                                {comm.title}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {comm.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Membership Fee ($300), Deposit Slip Upload, & Consent */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                      Membership Fee Transfer & Data Consent
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Complete payment via HSBC bank transfer and upload your transaction receipt.
                    </p>
                  </div>

                  {/* Bank Account Transfer Card */}
                  <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-md border border-slate-800">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                      <div>
                        <span className="text-[11px] font-semibold text-emerald-400 tracking-wider uppercase">
                          One-Time Life/Ordinary Fee
                        </span>
                        <div className="text-2xl font-black text-white mt-0.5">
                          HK$300.00
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-200">
                        004 匯豐銀行 (HSBC)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium block">Account Name:</span>
                        <span className="font-semibold text-sm text-slate-100">HKU**-ENG SOCIETY</span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-medium block">Bank Account Number:</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-base font-bold text-emerald-400">
                            178-790903-838
                          </span>
                          <button
                            type="button"
                            onClick={copyBankDetails}
                            className="p-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-slate-200 cursor-pointer"
                            title="Copy Account Number"
                          >
                            {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          {copiedBank && <span className="text-[11px] text-emerald-400 font-semibold">Copied!</span>}
                        </div>
                      </div>
                    </div>

                    {/* Alternative payment contact */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
                      <span>Prefer other payment methods?</span>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 text-pink-400">
                          <Instagram className="w-3.5 h-3.5" /> IG: enginsoc.hku
                        </span>
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Crystal Fung: 64656410
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bank Deposit Slip Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                      Upload Bank Deposit Slip / Transfer Screenshot <span className="text-red-500">*</span>
                    </label>

                    {formData.depositSlipName ? (
                      <div className="p-4 rounded-2xl border border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {formData.depositSlipDataUrl ? (
                            <img
                              src={formData.depositSlipDataUrl}
                              alt="Deposit slip thumbnail"
                              className="w-14 h-14 object-cover rounded-xl border border-emerald-200 dark:border-emerald-800"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600">
                              <FileText className="w-6 h-6" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 max-w-xs truncate">
                              {formData.depositSlipName}
                            </p>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                              ✓ Slip attached & ready for submission
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={removeFileUpload}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className={`block border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                        errors.depositSlip 
                          ? 'border-red-400 bg-red-50/20 dark:bg-red-950/10' 
                          : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/20'
                      }`}>
                        <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                          Click to upload or drag & drop bank transfer receipt
                        </span>
                        <span className="text-xs text-slate-400 block mt-1">
                          Accepts PNG, JPG, JPEG, or PDF slip (max 8MB)
                        </span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleFileUpload}
                          className="sr-only"
                        />
                      </label>
                    )}

                    {errors.depositSlip && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.depositSlip}
                      </p>
                    )}
                  </div>

                  {/* Personal Data Consent Agreement */}
                  <div className="pt-2">
                    <label className={`p-4 rounded-2xl border cursor-pointer block transition-all ${
                      formData.agreedToTerms
                        ? 'border-indigo-600 bg-indigo-50/80 dark:border-indigo-500 dark:bg-indigo-950/30'
                        : errors.agreedToTerms
                        ? 'border-red-500 bg-red-50/20 dark:bg-red-950/20'
                        : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/40'
                    }`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={formData.agreedToTerms}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, agreedToTerms: e.target.checked }));
                            if (errors.agreedToTerms) setErrors((prev) => ({ ...prev, agreedToTerms: "" }));
                          }}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 block mb-1">
                            Consent and Personal Data Authorization <span className="text-red-500">*</span>
                          </span>
                          By submitting this form, you consent to the collection, storage, and use of your personal data for membership administration and verification purposes, including access by authorised society personnel through a secure web-based system.
                        </div>
                      </div>
                    </label>

                    {errors.agreedToTerms && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.agreedToTerms}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: Summary / All Set Confirmation */}
              {currentStep === 4 && (
                <div className="text-center py-4 space-y-6">
                  <div className="inline-flex p-4 rounded-3xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-50 dark:ring-emerald-900/20">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>

                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                      Application Submitted • Pending Verification
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                      Welcome to HKU Engineering Society!
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto mt-1">
                      Thank you for completing your membership registration, <span className="font-bold text-slate-900 dark:text-white">{formData.englishName}</span>. Your details and payment deposit slip have been recorded.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 text-left max-w-xl mx-auto shadow-xs text-xs sm:text-sm">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                        Registration Summary
                      </span>
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                        UID: {formData.uid}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="text-slate-400 block">English Name:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{formData.englishName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Chinese Name:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{formData.chineseName || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Gender:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{formData.gender}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Curriculum:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                          {formData.curriculum === "Other" ? formData.curriculumOther : formData.curriculum} (Year {formData.year === "Other" ? formData.yearOther : formData.year})
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 block">HKU Email:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{formData.hkuEmail}</span>
                      </div>
                      {formData.phone && (
                        <div className="col-span-2">
                          <span className="text-slate-400 block">Phone Number:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-100">{formData.phone}</span>
                        </div>
                      )}
                      <div className="col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-slate-400 block mb-1">Selected Sports Events:</span>
                        <div className="flex flex-wrap gap-1">
                          {formData.curricularEvents.length > 0 ? (
                            formData.curricularEvents.map((evt) => (
                              <span key={evt} className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-medium">
                                {evt}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-xs">None selected</span>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2 pt-1">
                        <span className="text-slate-400 block mb-1">Interested Committees:</span>
                        <div className="flex flex-wrap gap-1">
                          {formData.committees.length > 0 ? (
                            formData.committees.map((com) => (
                              <span key={com} className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-medium">
                                {com}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-xs">None selected</span>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                        <span className="text-slate-400">Payment Status:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          HK$300 (Slip: {formData.depositSlipName})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {currentStep > 0 && currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handlePrevious}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
            ) : <div />}

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                {currentStep === 0 ? "Agree & Continue" : currentStep === steps.length - 2 ? "Submit Membership" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  alert("Membership application saved! Your registration has been dispatched to the society committee.");
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Finish & Close
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
