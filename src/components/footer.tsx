'use client';

import Link from "next/link";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  ExternalLink,
  Shield,
  Heart,
  Facebook,
  Twitter,
  Linkedin,
  Youtube
} from "lucide-react";
import { mainNavItems, footerLinks, contactInfo } from "@/config/navigation";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link href={item.href} className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                      <Icon className="h-3 w-3" />
                      {item.label === 'Documents' ? 'Documents & Forms' : item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label === 'Privacy Policy' && <Shield className="h-3 w-3" />}
                    {link.label === 'Patient Portal' && <Heart className="h-3 w-3" />}
                    {link.label}
                    {link.external && <ExternalLink className="h-3 w-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                <span>
                  {contactInfo.address.street}<br />
                  {contactInfo.address.city}
                </span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3 w-3" />
                <a href={`tel:${contactInfo.phone.replace(/[^0-9]/g, '')}`} className="hover:text-primary transition-colors">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-3 w-3" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-primary transition-colors">
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{contactInfo.hours}</span>
              </li>
            </ul>
          </div>

          {/* Social & Additional */}
          <div>
            <h3 className="font-semibold mb-4">Stay Connected</h3>
            <div className="flex gap-3 mb-4">
              {footerLinks.social.map((social) => {
                const Icon = {
                  Facebook,
                  Twitter,
                  LinkedIn: Linkedin,
                  YouTube: Youtube
                }[social.platform];
                
                return Icon ? (
                  <a 
                    key={social.platform}
                    href={social.href} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.platform}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ) : null;
              })}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Emergency? Call 911
            </p>
            <p className="text-sm text-muted-foreground">
              For urgent imaging needs,<br />
              contact your care team.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 Weill Cornell Imaging at NewYork-Presbyterian. All rights reserved.</p>
          <p className="mt-2">
            WCI@NYP is a collaboration between{" "}
            <a href="https://weillcornell.org" className="hover:text-primary transition-colors">
              Weill Cornell Medicine
            </a>
            {" and "}
            <a href="https://nyp.org" className="hover:text-primary transition-colors">
              NewYork-Presbyterian Hospital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}