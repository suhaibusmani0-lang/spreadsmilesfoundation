'use client';

import React from 'react';
import { Calendar, Users, MapPin, Target, Eye, CheckCircle2 } from 'lucide-react';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Mohd Minhaj Alam Khan',
      role: 'PRESIDENT',
      description:
        'A visionary leader dedicated to uplifting underprivileged communities through impactful initiatives, committed to driving sustainable change and fostering equal opportunities for all.',
      image: '/team/minhaj.jpg',
    },
    {
      name: 'Afhaam Alam',
      role: 'Secretary',
      description:
        'An enthusiastic social worker with a passion for organizing community programs, ensuring smooth operations, and building meaningful connections for the betterment of society.',
      image: '/team/afhaam.jpg',
    },
    {
      name: 'Farhat Parveen',
      role: 'Treasurer',
      description:
        'Trusted financial guardian ensuring transparency, accountability, and efficient use of every contribution for social good.',
      image: '/team/farhat.jpg',
    },
    {
      name: 'Kabir Ahmad Ansari',
      role: 'Joint Secretary',
      description:
        'A proactive team member dedicated to smooth operations and strengthening community-driven initiatives.',
      image: '/team/kabir.jpg',
    },
    {
      name: 'Ateef Khan',
      role: 'Joint Secretary',
      description:
        'Passionate about social service, fostering collaboration and driving impactful welfare programs with commitment.',
      image: '/team/ateef.jpg',
    },
    {
      name: 'Devendra Deshbandhu',
      role: 'Joint Secretary',
      description:
        'A problem-solver and dedicated team member, focused on implementing projects that create lasting positive change.',
      image: '/team/devendra.jpg',
    },
  ];

  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* 1. HERO SECTION */}
      <section className="pt-20 pb-16 px-4 bg-gradient-to-b from-blue-50/50 to-white text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-blue-100 text-[#2081e2] px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-6">
            Spread Smiles Foundation
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            About <span className="text-[#2081e2]">Spread Smiles</span> <span className="text-green-500">Foundation</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Founded with a mission to bring hope and happiness to underprivileged communities, Spread Smiles Foundation
            focuses on education, healthcare, and social upliftment. Our dedicated team works tirelessly to ensure that
            every individual gets the opportunity to live with dignity and a smile.
          </p>
        </div>
      </section>

      {/* 2. STATS CARDS */}
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50/50 p-8 rounded-3xl text-center border border-blue-100/50 hover:shadow-md transition-all">
            <Calendar className="w-8 h-8 text-[#2081e2] mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 text-lg mb-1">Established</h3>
            <p className="text-[#2081e2] font-semibold">April 20, 2023</p>
          </div>
          <div className="bg-green-50/50 p-8 rounded-3xl text-center border border-green-100/50 hover:shadow-md transition-all">
            <Users className="w-8 h-8 text-green-500 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 text-lg mb-1">Lives Impacted</h3>
            <p className="text-green-500 font-semibold">5,000+</p>
          </div>
          <div className="bg-yellow-50/50 p-8 rounded-3xl text-center border border-yellow-100/50 hover:shadow-md transition-all">
            <MapPin className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 text-lg mb-1">Location</h3>
            <p className="text-yellow-600 font-semibold">Delhi, India</p>
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 relative">
            <div className="absolute -top-6 left-8 bg-[#2081e2] p-3 rounded-2xl shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to serve humanity by providing education, healthcare, and essential support to
              underprivileged communities, empowering them to lead a life of dignity, hope, and opportunity.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 relative mt-8 md:mt-0">
            <div className="absolute -top-6 left-8 bg-green-500 p-3 rounded-2xl shadow-lg">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To create a compassionate and empowered society where every individual has access to education,
              healthcare, and the resources needed to live a dignified life.
            </p>
          </div>
        </div>
      </section>

      {/* 4. OUR APPROACH */}
      <section className="py-16 px-4 bg-gray-50/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Approach</h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* What We Do */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-gray-900">What We Do</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2081e2] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Work with schools under Vidyanjali initiatives</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2081e2] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Distribute winter sweaters and warm clothing to students</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2081e2] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Provide school uniforms and bags to underprivileged children</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2081e2] shrink-0 mt-0.5" />
                  <span className="text-gray-600">Organize regular healthcare and blood donation camps</span>
                </li>
              </ul>
            </div>

            {/* Where We Work */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-gray-900">Where We Work</h3>
              <p className="text-gray-600 mb-6">
                Currently active in Delhi, we focus our efforts on areas with the greatest need, particularly in Shaheen
                Bagh, Jamia Nagar, and surrounding communities.
              </p>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-2">Primary Location</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  F 235/3, Common Services, Shaheen Bagh, Abul Fazal Enclave, Part-II, Jamia Nagar, New Delhi 110025
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MEET OUR TEAM */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Meet Our <span className="text-[#2081e2]">Team</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our passionate team of leaders who are dedicated to making a positive impact in the lives of those who need it most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 text-center hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gray-50 bg-gray-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-[#2081e2] text-sm font-bold tracking-wide uppercase mb-4">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
