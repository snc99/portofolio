"use client";

import React from "react";
import { Card, CardContent } from "../ui/card";

interface WelcomeSectionProps {
  name: string;
}

const WelcomeSection = ({ name }: WelcomeSectionProps) => {
  return (
    <div>
      <Card className="bg-gradient-to-r from-blue-500 to-blue-400 text-white">
        <CardContent className="p-6 text-lg font-semibold">
          Hello, {name} 👋
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeSection;
