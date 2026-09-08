import React from "react";
import { Header } from "@/components/ui/custom/core/Header";
import { Footer } from "@/components/ui/custom/core/Footer";

const DISCORD_URL = "https://discord.gg/gvhsk8NZHD";
const CONTACT_EMAIL = "soldankpp@gmail.com";

const Section = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <section className="flex flex-col gap-3">
        <h2 className="text-xl">{title}</h2>
        <div className="text-sm text-white/70 space-y-3 [&_a]:underline">
            {children}
        </div>
    </section>
);

const List = ({ items }: { items: string[] }) => (
    <ul className="list-disc space-y-1 pl-5">
        {items.map((item) => (
            <li key={item}>{item}</li>
        ))}
    </ul>
);

const Privacy = () => {
    return (
        <>
            <Header />
            <main>
                <div className="px-6 sm:px-12 lg:px-20 flex justify-center">
                    <div className="w-full max-w-3xl mt-60 mb-20 flex flex-col gap-10 text-white">
                        <div className="flex flex-col gap-3">
                            <span className="font-tomorrow text-xs uppercase tracking-widest text-blue-200">
                                · privacy
                            </span>
                            <h1>Privacy Policy</h1>
                            <p className="text-sm text-white/70">
                                Last updated: 8 September 2026
                            </p>
                        </div>

                        <Section title="Who runs this site">
                            <p>
                                This website is operated by the Soldank++
                                Development Team as a non-profit, open-source
                                project.
                            </p>
                            <p>
                                If you have a question about this Privacy
                                Policy, your personal data, or your Soldank++
                                profile, you can contact us by email at{" "}
                                <a href={`mailto:${CONTACT_EMAIL}`}>
                                    {CONTACT_EMAIL}
                                </a>{" "}
                                or on <a href={DISCORD_URL}>Discord</a>.
                            </p>
                        </Section>

                        <Section title="What this policy covers">
                            <p>
                                This Privacy Policy explains how the Soldank++
                                website handles information when you visit the
                                site or view player profiles, rankings,
                                statistics and records.
                            </p>
                            <p>
                                The website is primarily a read-only
                                presentation of data generated through playing
                                Soldank++. The website does not create or modify
                                player statistics based on your visit.
                            </p>
                            <p>
                                Game accounts and game statistics are created
                                through Soldank++ itself and are separate from
                                accounts on this website.
                            </p>
                        </Section>

                        <Section title="No tracking or advertising">
                            <p>We do not use:</p>
                            <List
                                items={[
                                    "analytics services",
                                    "advertising",
                                    "tracking pixels",
                                    "tracking cookies",
                                    "fingerprinting",
                                    "Google Analytics",
                                    "Sentry or similar monitoring services",
                                    "marketing trackers",
                                ]}
                            />
                            <p>
                                We do not profile visitors, and we do not sell
                                personal information or share it with third
                                parties for marketing purposes. You do not need
                                an account to browse the website.
                            </p>
                            <p>
                                Apart from the YouTube player described below,
                                the website does not automatically load
                                third-party resources when you visit a page.
                                Fonts, images and map screenshots used by the
                                website are served from our own website.
                            </p>
                        </Section>

                        <Section title="Cookies">
                            <p>
                                The website uses one functional cookie named{" "}
                                <code>sidebar_state</code>, which remembers
                                whether the navigation sidebar is expanded or
                                collapsed.
                            </p>
                            <p>
                                It contains only this interface preference and
                                is not used to identify you, track you, analyse
                                your behaviour or serve advertising. The cookie
                                is set for the website path (<code>/</code>) and
                                contains only a <code>true</code> or{" "}
                                <code>false</code> value.
                            </p>
                            <p>
                                We do not use cookies for analytics, advertising
                                or behavioural tracking.
                            </p>
                        </Section>

                        <Section title="Server and API logs">
                            <p>
                                Our statistics API records limited information
                                about failed HTTP requests for the purpose of
                                identifying broken pages and technical problems.
                            </p>
                            <p>
                                For responses with an HTTP status code of 400 or
                                higher, the application records:
                            </p>
                            <List
                                items={[
                                    "the HTTP request method",
                                    "the requested URL path",
                                    "the HTTP status code",
                                ]}
                            />
                            <p>
                                The query string is not retained in these
                                application logs. The application does not
                                intentionally record:
                            </p>
                            <List
                                items={[
                                    "IP addresses",
                                    "browser User-Agent information",
                                    "request bodies",
                                    "request headers",
                                    "email addresses",
                                    "passwords",
                                    "Steam IDs",
                                    "Discord IDs",
                                ]}
                            />
                            <p>
                                Application logs are written to the
                                server&apos;s standard logger and are cleared
                                approximately every 7 days.
                            </p>
                            <p>
                                The website and statistics API are hosted on a
                                private VPS provided by OVH, with the server
                                located in Poland. OVH may maintain its own
                                infrastructure and security logs, including
                                information such as IP addresses, in accordance
                                with its own policies. Such infrastructure-level
                                logging is controlled by the hosting provider
                                rather than by the Soldank++ application.
                            </p>
                        </Section>

                        <Section title="Player profiles and statistics">
                            <p>
                                The rankings and profile pages display
                                information generated through playing Soldank++.
                                Depending on the game data available, a public
                                player profile may contain:
                            </p>
                            <List
                                items={[
                                    "in-game username",
                                    "country",
                                    "clan name and clan tag",
                                    "medal statistics",
                                    "map completion statistics",
                                    "unique and total captures",
                                    "number of passed maps",
                                    "maps remaining",
                                    "maps created",
                                    "hardest-map ranking",
                                    "playtime",
                                    "records and record times",
                                    "dates on which records were achieved",
                                    "positions on individual maps",
                                    "ranking positions",
                                    "daily activity history",
                                    "account creation date",
                                    "last activity date",
                                ]}
                            />
                            <p>
                                This information comes from Soldank++ game
                                databases through the statistics API. It is not
                                collected from your visit to this website, and
                                the website does not add personal information to
                                a player profile merely because someone visits
                                it.
                            </p>
                            <p>
                                The statistics API used by the website is
                                read-only. The website does not provide
                                functionality for visitors to create, modify or
                                submit player statistics.
                            </p>
                        </Section>

                        <Section title="Player usernames">
                            <p>
                                Soldank++ profiles use in-game usernames rather
                                than requiring a real name. The website does not
                                require an email address, Steam account or
                                Discord account to display a player profile.
                            </p>
                            <p>
                                Please remember that information you choose to
                                use as your in-game username may still identify
                                you if you voluntarily choose a username that
                                contains your real name or other identifying
                                information.
                            </p>
                        </Section>

                        <Section title="Game accounts">
                            <p>
                                Soldank++ game accounts use an in-game nickname.
                                The web statistics database does not store login
                                passwords, email addresses, Steam IDs or Discord
                                IDs.
                            </p>
                            <p>
                                A player may request that their game account and
                                associated profile be removed. Where
                                appropriate, we may also anonymise historical
                                statistics so that they are no longer associated
                                with the original username.
                            </p>
                        </Section>

                        <Section title="Deleting or anonymising a profile">
                            <p>
                                If you are a Soldank++ player and want your
                                profile removed from the website, contact us at{" "}
                                <a href={`mailto:${CONTACT_EMAIL}`}>
                                    {CONTACT_EMAIL}
                                </a>{" "}
                                or through our{" "}
                                <a href={DISCORD_URL}>Discord server</a>. We may
                                ask for reasonable information needed to
                                identify the relevant account and prevent
                                requests concerning another player&apos;s
                                account.
                            </p>
                            <p>
                                Where technically possible, we will remove the
                                player account and its associated profile. Some
                                historical records are linked to player IDs and
                                may affect rankings and positions of other
                                players, so removing those records can alter
                                historical rankings.
                            </p>
                            <p>
                                Depending on the circumstances, we may instead
                                anonymise the player identity while retaining
                                historical results. In that case, the original
                                username is removed or replaced and the
                                historical results are no longer publicly
                                associated with that player.
                            </p>
                        </Section>

                        <Section title="How long we keep player statistics">
                            <p>
                                Player statistics generated through Soldank++
                                may be retained indefinitely, because historical
                                rankings, records and map results form part of
                                the game&apos;s statistics and history.
                            </p>
                            <p>
                                If a player requests removal, we will handle the
                                request as described in the section on deleting
                                or anonymising a profile.
                            </p>
                        </Section>

                        <Section title="The trailer video">
                            <p>
                                The trailer on the home page is not loaded from
                                YouTube until you press Play. Before you press
                                Play, the YouTube iframe does not exist on the
                                page and the website does not make a request to
                                YouTube for the video.
                            </p>
                            <p>
                                After you press Play, the video is loaded using
                                YouTube&apos;s privacy-enhanced domain,{" "}
                                <code>youtube-nocookie.com</code>. At that
                                point, Google and YouTube may receive
                                information such as your IP address and
                                information about your device and browser as
                                necessary to provide the video.
                            </p>
                            <p>
                                The processing of information by Google is
                                governed by Google&apos;s own privacy practices,
                                described in the{" "}
                                <a
                                    href="https://policies.google.com/privacy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Google Privacy Policy
                                </a>
                                . If you do not want the YouTube player to be
                                loaded, you can simply choose not to press Play.
                            </p>
                        </Section>

                        <Section title="External links">
                            <p>
                                The website contains links to external services
                                such as Discord, GitHub, X, Reddit, TikTok,
                                Instagram and the Soldank++ browser client.
                            </p>
                            <p>
                                These are ordinary links. The website does not
                                load these services or send information to them
                                merely because you visit our website. When you
                                choose to follow one of these links, you leave
                                our website and the destination service may
                                process information about you according to its
                                own privacy policy.
                            </p>
                        </Section>

                        <Section title="Legal basis for processing">
                            <p>
                                Where the General Data Protection Regulation
                                (GDPR) applies, we process information only
                                where there is an applicable legal basis.
                                Depending on the particular processing activity,
                                this may include:
                            </p>
                            <List
                                items={[
                                    "our legitimate interest in operating, maintaining and securing the website",
                                    "our legitimate interest in maintaining game statistics, rankings and historical records",
                                    "fulfilling requests made by players concerning their accounts or profiles",
                                    "consent or another applicable legal basis where required for third-party content such as embedded YouTube videos",
                                ]}
                            />
                            <p>
                                We do not use player statistics for advertising
                                or behavioural profiling.
                            </p>
                        </Section>

                        <Section title="Your rights">
                            <p>
                                If the GDPR or other applicable data protection
                                law applies to you, you may have rights
                                including the right to:
                            </p>
                            <List
                                items={[
                                    "request access to personal data concerning you",
                                    "request correction of inaccurate data",
                                    "request deletion of personal data",
                                    "request restriction of processing",
                                    "object to certain processing",
                                    "request portability of data where applicable",
                                    "withdraw consent where processing is based on consent",
                                ]}
                            />
                            <p>
                                You can exercise these rights by contacting us
                                at{" "}
                                <a href={`mailto:${CONTACT_EMAIL}`}>
                                    {CONTACT_EMAIL}
                                </a>{" "}
                                or through our{" "}
                                <a href={DISCORD_URL}>Discord server</a>. You
                                also have the right to lodge a complaint with a
                                competent data protection authority if you
                                believe that your personal data has been
                                processed unlawfully.
                            </p>
                            <p>
                                Regardless of where you live, you may contact us
                                if you want your Soldank++ profile removed or
                                anonymised, and we will review the request.
                            </p>
                        </Section>

                        <Section title="Data security">
                            <p>
                                We take reasonable technical and organisational
                                measures to protect the information handled by
                                the Soldank++ website and statistics API. The
                                website does not intentionally collect
                                passwords, email addresses, IP addresses, Steam
                                IDs or Discord IDs through the public statistics
                                system.
                            </p>
                            <p>
                                However, no internet service can guarantee
                                absolute security.
                            </p>
                        </Section>

                        <Section title="Children">
                            <p>
                                The Soldank++ website does not set a specific
                                minimum age for visitors. It does not knowingly
                                require children to provide an email address,
                                real name or other identifying information in
                                order to browse it.
                            </p>
                        </Section>

                        <Section title="International users">
                            <p>
                                The website is publicly accessible worldwide and
                                does not use geographic restrictions. Because
                                the website may be accessed from different
                                countries, the privacy laws applicable to a
                                particular visitor may vary, and we aim to
                                handle personal information in accordance with
                                applicable data protection laws.
                            </p>
                        </Section>

                        <Section title="Changes to this policy">
                            <p>
                                If the way the Soldank++ website handles
                                information changes, this Privacy Policy will be
                                updated. The date at the top of this page
                                changes when the policy is materially updated.
                            </p>
                        </Section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Privacy;
