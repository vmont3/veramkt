import React from 'react';
import Layout from '../components/Layout';

// Image paths
const avatars = {
    maestra: "/avatars/avatar_maestra_vera_1768038994316.png",
    linkedin: "/avatars/avatar_linklead_linkedin_1768039007951.png",
    instagram: "/avatars/avatar_instaexpert_instagram_1768039022316.png",
    facebook: "/avatars/avatar_facemanager_facebook_1768039037474.png",
    google: "/avatars/avatar_googlemaster_google_1768039064114.png",
    tiktok: "/avatars/avatar_toktrend_tiktok_1768039078455.png",
    whatsapp: "/avatars/avatar_zapcloser_whatsapp_1768039093427.png",
    youtube: "/avatars/avatar_tubevision_youtube_1768039108976.png"
};

const AvatarCard = ({ name, role, image, color }: { name: string, role: string, image: string, color: string }) => (
    <div className="group relative flex flex-col items-center">
        {/* Card Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800/0 to-gray-900/80 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Avatar Image */}
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-3xl border border-gray-800 group-hover:border-gray-600 transition-all duration-500 shadow-2xl">
            <img
                src={image}
                alt={name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            {/* Overlay Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80`} />

            {/* Text Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-white font-sans">{name}</h3>
                <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${color}`}>{role}</p>
            </div>
        </div>
    </div>
);

export default function TestRobotsPage() {
    return (
        <Layout>
            <div className="bg-black text-white min-h-screen py-24 px-4 neural-bg">
                <div className="text-center mb-16 relative z-10">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 font-sans tracking-tight">
                        Equipe de Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">VERA</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Conheça os agentes treinados que irão operar sua marca 24/7.
                    </p>
                </div>

                <div className="container mx-auto px-4 max-w-8xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <AvatarCard name="Maestra VERA" role="Orchestrator" image={avatars.maestra} color="text-white" />
                        <AvatarCard name="LinkLead" role="LinkedIn Strategist" image={avatars.linkedin} color="text-blue-400" />
                        <AvatarCard name="InstaExpert" role="Instagram Specialist" image={avatars.instagram} color="text-pink-500" />
                        <AvatarCard name="FaceManager" role="Facebook Manager" image={avatars.facebook} color="text-blue-600" />
                        <AvatarCard name="GoogleMaster" role="Ads Scientist" image={avatars.google} color="text-red-500" />
                        <AvatarCard name="TokTrend" role="TikTok Creator" image={avatars.tiktok} color="text-cyan-400" />
                        <AvatarCard name="ZapCloser" role="WhatsApp Sales" image={avatars.whatsapp} color="text-green-500" />
                        <AvatarCard name="TubeVision" role="YouTube Producer" image={avatars.youtube} color="text-red-600" />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
