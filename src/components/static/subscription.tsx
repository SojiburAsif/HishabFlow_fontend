"use client";

import React, { useState } from 'react';
import { Check, X, Zap, Crown, Sparkles, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Subscription() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');

  const plans = [
    {
      name: "Free",
      price: "0",
      icon: <Zap className="text-zinc-400 dark:text-zinc-500" size={24} />,
      description: "Perfect for getting started — 1 free high-res download per day.",
      buttonText: "Get Started for Free",
      isPopular: false,
      features: [
        { text: "Access to every mockup template", included: true },
        { text: "1 high-res download per day", included: true },
        { text: "Priority email support", included: true },
        { text: "Early access to new releases", included: false },
        { text: "Online Editable", included: false },
        { text: "Access all mockups in Figma", included: false },
        { text: "Access all mockups in Adobe add-ons", included: false },
        { text: "Commercial license included", included: false },
      ]
    },
    {
      name: "Pro",
      price: billingCycle === 'monthly' ? "24" : "20",
      icon: <Star className="text-purple-600 dark:text-purple-400" size={24} fill="currentColor" fillOpacity={0.2} />,
      description: "Perfect for freelancers and small teams — 30 mockups/day.",
      buttonText: "Subscribe Now",
      isPopular: true,
      features: [
        { text: "Access to every mockup template", included: true },
        { text: "30 high-res downloads each day", included: true },
        { text: "Priority email support", included: true },
        { text: "Early access to new releases", included: true },
        { text: "Online Editable", included: true },
        { text: "Access all mockups in Figma", included: true },
        { text: "Access all mockups in Adobe add-ons", included: true },
        { text: "Commercial license included", included: false },
      ]
    },
    {
      name: "Unlimited",
      price: billingCycle === 'monthly' ? "45" : "35",
      icon: <Crown className="text-amber-500" size={24} fill="currentColor" fillOpacity={0.2} />,
      description: "Best value for agencies and power users — unlimited downloads.",
      buttonText: "Subscribe Now",
      isPopular: false,
      features: [
        { text: "Access to every mockup template", included: true },
        { text: "Unlimited high-res downloads", included: true },
        { text: "Priority email & chat support", included: true },
        { text: "Early access to new releases", included: true },
        { text: "Online Editable", included: true },
        { text: "Access all mockups in Figma", included: true },
        { text: "Access all mockups in Adobe add-ons", included: true },
        { text: "Commercial license included", included: true },
      ]
    }
  ];

  return (
    <section className="py-24 bg-black transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Sparkles className="text-purple-600" size={20} />
            <span className="text-purple-600 font-black uppercase tracking-[0.2em] text-[10px]">Pricing Plans</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-black font-sans text-white mb-6 tracking-tight">
            Flexible Plans <br /> for Every Need
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Gain unlimited access to our entire collection of mockups through one simple, hassle-free subscription.
          </p>

          {/* Billing Toggle */}
          <div className="mt-10 flex items-center justify-center">
            <div className="p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center relative border border-zinc-200 dark:border-zinc-800">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-8 py-2.5 rounded-full text-xs font-black transition-all relative z-10 ${billingCycle === 'monthly' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('annually')}
                className={`px-8 py-2.5 rounded-full text-xs font-black transition-all relative z-10 flex items-center gap-2 ${billingCycle === 'annually' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}
              >
                Annually
                <span className="bg-purple-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">Save 20%</span>
              </button>
              
              {/* Toggle Slider */}
              <motion.div 
                animate={{ x: billingCycle === 'monthly' ? 0 : 106 }}
                className="absolute w-[100px] h-9 bg-white dark:bg-zinc-800 rounded-full shadow-md border border-zinc-200 dark:border-zinc-700"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-500 border ${
                plan.isPopular 
                ? 'bg-zinc-950 border-purple-500 shadow-2xl scale-105 z-10' 
                : 'bg-zinc-950/80 border-zinc-800 hover:border-purple-500/40'
              }`}
            >
              {/* Most Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-purple-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
                  <Star size={10} fill="white" />
                  Most Popular
                </div>
              )}

              {/* Icon & Title */}
              <div className="mb-6 flex justify-between items-start">
                <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm">
                  {plan.icon}
                </div>
                {plan.isPopular && <Sparkles className="text-purple-500 opacity-50" size={20} />}
              </div>

              <div className="mb-8">
                <h3 className={`text-2xl font-black mb-3 ${plan.isPopular ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-900 dark:text-white'}`}>
                  {plan.name}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold leading-relaxed mb-6">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white tracking-tighter">${plan.price}</span>
                  <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
              </div>

              {/* Action Button */}
              <button className={`w-full py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all mb-10 flex items-center justify-center gap-2 group ${
                plan.isPopular 
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:scale-[1.02]' 
                : 'bg-zinc-900 text-white border border-zinc-800 hover:border-purple-500'
              }`}>
                {plan.buttonText}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Feature List */}
              <div className="space-y-4 flex-grow">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className={`flex items-start gap-3 ${feature.included ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`mt-0.5 p-0.5 rounded-full border ${feature.included ? 'border-purple-500 text-purple-600 dark:text-purple-400' : 'border-zinc-400 text-zinc-400'}`}>
                      {feature.included ? <Check size={10} strokeWidth={4} /> : <X size={10} strokeWidth={4} />}
                    </div>
                    <span className={`text-[13px] font-bold ${feature.included ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Subtle Decorative Elements for Pro */}
              {plan.isPopular && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] to-transparent rounded-[2.5rem] pointer-events-none" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}