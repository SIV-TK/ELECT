"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, UserCheck, FileText, Camera, Loader2, AlertCircle } from 'lucide-react';

interface RegistrationData {
  nationalId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  county: string;
  constituency: string;
  ward: string;
  phoneNumber: string;
  email: string;
}

interface VerificationResult {
  status: 'pending' | 'verified' | 'rejected';
  voterNumber: string;
  pollingStation: string;
  message: string;
}

const counties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu', 'Kiambu'];
const constituencies = ['Westlands', 'Starehe', 'Kisumu East', 'Eldoret North'];
const wards = ['Parklands', 'Highridge', 'Milimani', 'Langas'];

export default function VoterRegistration() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    nationalId: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    county: '',
    constituency: '',
    ward: '',
    phoneNumber: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const updateFormData = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const submitRegistration = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/voter-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      setResult(data);
      setStep(5);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepIcon = (stepNumber: number) => {
    if (step > stepNumber) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (step === stepNumber) return <div className="h-5 w-5 rounded-full bg-primary" />;
    return <div className="h-5 w-5 rounded-full bg-muted" />;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Voter Registration</h1>
        <p className="text-muted-foreground">Register to vote in Kenya's elections</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className="flex flex-col items-center">
                {getStepIcon(stepNumber)}
                <span className="text-xs mt-1">
                  {stepNumber === 1 && 'Personal'}
                  {stepNumber === 2 && 'Location'}
                  {stepNumber === 3 && 'Contact'}
                  {stepNumber === 4 && 'Verify'}
                </span>
              </div>
              {stepNumber < 4 && (
                <div className={`h-0.5 w-16 mx-2 ${step > stepNumber ? 'bg-green-500' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
        <Progress value={(step / 4) * 100} className="mt-4" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && 'Personal Information'}
            {step === 2 && 'Location Details'}
            {step === 3 && 'Contact Information'}
            {step === 4 && 'Verification'}
            {step === 5 && 'Registration Complete'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Enter your basic personal details'}
            {step === 2 && 'Select your voting location'}
            {step === 3 && 'Provide contact information'}
            {step === 4 && 'Review and submit your registration'}
            {step === 5 && 'Your voter registration status'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nationalId">National ID Number</Label>
                  <Input
                    id="nationalId"
                    value={formData.nationalId}
                    onChange={(e) => updateFormData('nationalId', e.target.value)}
                    placeholder="12345678"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    placeholder="Doe"
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="county">County</Label>
                <Select value={formData.county} onValueChange={(value) => updateFormData('county', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    {counties.map(county => (
                      <SelectItem key={county} value={county}>{county}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="constituency">Constituency</Label>
                <Select value={formData.constituency} onValueChange={(value) => updateFormData('constituency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select constituency" />
                  </SelectTrigger>
                  <SelectContent>
                    {constituencies.map(constituency => (
                      <SelectItem key={constituency} value={constituency}>{constituency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ward">Ward</Label>
                <Select value={formData.ward} onValueChange={(value) => updateFormData('ward', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map(ward => (
                      <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                  placeholder="+254700000000"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Review Your Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
                  <div><strong>National ID:</strong> {formData.nationalId}</div>
                  <div><strong>Date of Birth:</strong> {formData.dateOfBirth}</div>
                  <div><strong>County:</strong> {formData.county}</div>
                  <div><strong>Constituency:</strong> {formData.constituency}</div>
                  <div><strong>Ward:</strong> {formData.ward}</div>
                  <div><strong>Phone:</strong> {formData.phoneNumber}</div>
                  <div><strong>Email:</strong> {formData.email}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
                <Camera className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Biometric Verification</p>
                  <p className="text-sm text-muted-foreground">Your biometric data will be captured during final verification</p>
                </div>
              </div>
            </div>
          )}

          {step === 5 && result && (
            <div className="text-center space-y-4">
              {result.status === 'verified' ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              ) : result.status === 'pending' ? (
                <UserCheck className="h-16 w-16 text-yellow-500 mx-auto" />
              ) : (
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
              )}
              
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {result.status === 'verified' && 'Registration Successful!'}
                  {result.status === 'pending' && 'Registration Pending'}
                  {result.status === 'rejected' && 'Registration Rejected'}
                </h3>
                <p className="text-muted-foreground mb-4">{result.message}</p>
                
                {result.status === 'verified' && (
                  <div className="space-y-2">
                    <Badge variant="default" className="text-lg px-4 py-2">
                      Voter Number: {result.voterNumber}
                    </Badge>
                    <p className="text-sm">Polling Station: {result.pollingStation}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && step < 5 && (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            
            {step < 4 && (
              <Button onClick={nextStep} className="ml-auto">
                Next
              </Button>
            )}
            
            {step === 4 && (
              <Button onClick={submitRegistration} disabled={isSubmitting} className="ml-auto">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Submit Registration
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}