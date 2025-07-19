import { Fragment } from 'react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-primary/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 002-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              <span className="text-xl font-bold">Sauti Ya Watu</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/politicians" className="text-sm hover:text-primary transition-colors">Politicians</a>
              <a href="/live-tally" className="text-sm hover:text-primary transition-colors">Live Tally</a>
              <a href="/sentiment-analysis" className="text-sm hover:text-primary transition-colors">Sentiment Analysis</a>
              <a href="/crowd-sourced-intel" className="text-sm hover:text-primary transition-colors">Intelligence</a>
            </nav>
            <div className="flex items-center gap-4">
              <a href="/login" className="text-sm hover:text-primary transition-colors">Log in</a>
              <a href="/signup" className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors">Sign up</a>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSIjZTBlN2ZmIi8+PC9zdmc+')] bg-[length:40px_40px]" />
          <div className="container relative mx-auto px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-sm text-primary transition-colors hover:bg-primary/30">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                For the People, By the People
              </div>

              <h1 className="mt-6 font-headline text-4xl font-bold sm:text-6xl md:text-7xl lg:text-8xl [text-wrap:balance] bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-accent animate-gradient">
                Your Voice, <br />
                Amplified.
              </h1>

              <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Sauti Ya Watu brings transparency and accountability to the Kenyan political landscape. Experience democracy enhanced by cutting-edge AI technology.
              </p>

              <div className="mt-12 flex flex-wrap gap-4 justify-center">
                <a href="/login" className="transform rounded-lg bg-primary px-8 py-4 text-sm font-medium text-white transition-all hover:scale-105 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  Get Started
                </a>
                <a href="https://github.com/ElECT-AI/peoples" target="_blank" rel="noopener noreferrer" className="transform rounded-lg border border-primary/20 bg-background/50 backdrop-blur-sm px-8 py-4 text-sm font-medium text-primary transition-all hover:scale-105 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-background via-background/90 to-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">Empowering Democracy with AI</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Transparent Voting",
                  description: "Experience secure, verifiable voting with real-time results and AI-powered verification.",
                  icon: (
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "AI-Powered Insights",
                  description: "Get deep insights into political sentiment and trends through advanced AI analysis.",
                  icon: (
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                },
                {
                  title: "Community Driven",
                  description: "Join a vibrant community of citizens working together for a more transparent democracy.",
                  icon: (
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <div key={index} className="p-6 rounded-xl bg-card hover:bg-card/80 transition-colors">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gradient-to-b from-background to-background/90">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">How Sauti Ya Watu Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Create Account",
                  description: "Sign up using your national ID and biometric verification for a secure, unique account."
                },
                {
                  step: "2",
                  title: "Verify Identity",
                  description: "Complete our AI-powered verification process to ensure the integrity of your participation."
                },
                {
                  step: "3",
                  title: "Engage & Contribute",
                  description: "Participate in polls, share insights, and contribute to community-driven political discourse."
                },
                {
                  step: "4",
                  title: "Make Impact",
                  description: "Your verified voice helps shape policies and ensures transparent democratic processes."
                }
              ].map((step, index) => (
                <div key={index} className="relative p-6">
                  <div className="text-4xl font-bold text-primary/20 absolute top-0 left-0">{step.step}</div>
                  <h3 className="text-xl font-semibold mb-2 mt-8">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-b from-background/90 to-background relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  value: "1M+",
                  label: "Active Citizens",
                  description: "Engaged Kenyans using our platform"
                },
                {
                  value: "47",
                  label: "Counties Covered",
                  description: "Nationwide representation"
                },
                {
                  value: "99.9%",
                  label: "Accuracy Rate",
                  description: "In AI-powered verifications"
                },
                {
                  value: "24/7",
                  label: "Availability",
                  description: "Round-the-clock democratic engagement"
                }
              ].map((stat, index) => (
                <div key={index} className="text-center p-6 rounded-xl bg-card/50 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="font-semibold mb-1">{stat.label}</div>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-b from-background to-background/90">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Trusted by Leaders & Citizens</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Sauti Ya Watu has revolutionized how we engage with our constituents. The AI-powered insights are invaluable.",
                  author: "Hon. Sarah Kimani",
                  role: "Member of Parliament"
                },
                {
                  quote: "Finally, a platform that gives citizens a real voice in the democratic process. The verification system ensures credibility.",
                  author: "Dr. John Odhiambo",
                  role: "Political Analyst"
                },
                {
                  quote: "The transparency and real-time insights have made our electoral process more efficient and trustworthy.",
                  author: "Mary Wanjiku",
                  role: "County Election Officer"
                }
              ].map((testimonial, index) => (
                <div key={index} className="p-6 rounded-xl bg-card">
                  <div className="mb-4">
                    <svg className="w-8 h-8 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="text-lg mb-4 text-muted-foreground">{testimonial.quote}</p>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-b from-background/90 to-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Make Your Voice Heard?</h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands of Kenyans who are already using Sauti Ya Watu to participate in shaping the future of our democracy.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/signup" className="transform rounded-lg bg-primary px-8 py-4 text-sm font-medium text-white transition-all hover:scale-105 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Create Free Account
              </a>
              <a href="/demo-voting" className="transform rounded-lg border border-primary/20 bg-background/50 backdrop-blur-sm px-8 py-4 text-sm font-medium text-primary transition-all hover:scale-105 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Try Demo
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 002-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <span className="text-xl font-bold">Sauti Ya Watu</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering democracy through technology and transparency.
              </p>
              <div className="flex gap-4">
                <a href="https://twitter.com/sautiyawatu" className="text-muted-foreground hover:text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://facebook.com/sautiyawatu" className="text-muted-foreground hover:text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://github.com/ElECT-AI/peoples" className="text-muted-foreground hover:text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/politicians" className="text-sm text-muted-foreground hover:text-primary">Politicians</a></li>
                <li><a href="/live-tally" className="text-sm text-muted-foreground hover:text-primary">Live Tally</a></li>
                <li><a href="/sentiment-analysis" className="text-sm text-muted-foreground hover:text-primary">Sentiment Analysis</a></li>
                <li><a href="/verification-gallery" className="text-sm text-muted-foreground hover:text-primary">Verification Gallery</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="/docs/api" className="text-sm text-muted-foreground hover:text-primary">API Documentation</a></li>
                <li><a href="/docs/guides" className="text-sm text-muted-foreground hover:text-primary">Integration Guides</a></li>
                <li><a href="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog</a></li>
                <li><a href="/press" className="text-sm text-muted-foreground hover:text-primary">Press Kit</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</a></li>
                <li><a href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</a></li>
                <li><a href="/security" className="text-sm text-muted-foreground hover:text-primary">Security</a></li>
                <li><a href="/accessibility" className="text-sm text-muted-foreground hover:text-primary">Accessibility</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-primary/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © 2025 Sauti Ya Watu. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <a href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</a>
                <a href="/help" className="text-sm text-muted-foreground hover:text-primary">Help Center</a>
                <select className="text-sm bg-transparent border-none text-muted-foreground hover:text-primary cursor-pointer">
                  <option value="en">English</option>
                  <option value="sw">Kiswahili</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
