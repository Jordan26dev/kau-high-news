import type { HomepageSettings } from "@/types/newsroom";

type NewsroomContactsSectionProps = Pick<
  HomepageSettings,
  "contactsTitle" | "contactsDescription" | "contacts"
>;

export default function NewsroomContactsSection({
  contactsTitle,
  contactsDescription,
  contacts,
}: NewsroomContactsSectionProps) {
  return (
    <section id="contact" aria-labelledby="newsroom-contact-heading" className="mx-auto max-w-7xl px-6 py-10">
      <div className="border-y-2 border-[#5b1212] bg-[#fffdf7] p-6 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">
            Get in touch
          </p>
          <h2 id="newsroom-contact-heading" className="mt-2 font-serif text-3xl font-bold text-[#3b0a0a]">
            {contactsTitle}
          </h2>
          <p className="mt-3 leading-7 text-slate-600">{contactsDescription}</p>
        </div>

        {contacts.length > 0 ? (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <li key={contact.key} className="border-t border-[#d9c7ae] bg-white p-5">
                <h3 className="font-serif text-xl font-bold text-slate-900">{contact.name}</h3>
                {contact.purpose ? (
                  <p className="mt-2 text-sm leading-6 text-slate-600">{contact.purpose}</p>
                ) : null}
                <div className="mt-4 flex flex-col items-start gap-3">
                  {contact.email ? (
                    <a
                      href={`mailto:${contact.email}`}
                      className="font-semibold text-[#7f1919] underline underline-offset-4 hover:text-[#5b1212] focus:outline-none focus:ring-2 focus:ring-[#7f1919]"
                    >
                      Email {contact.name}
                    </a>
                  ) : null}
                  {contact.website ? (
                    <a
                      href={contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#7f1919] underline underline-offset-4 hover:text-[#5b1212] focus:outline-none focus:ring-2 focus:ring-[#7f1919]"
                    >
                      {contact.websiteLabel || "Visit website"}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : null}
                  {!contact.email && !contact.website ? (
                    <p className="text-sm text-slate-500">Contact information coming soon.</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 border border-dashed border-[#cbb99f] bg-white p-5 text-slate-600">
            Contact details will be added here.
          </p>
        )}
      </div>
    </section>
  );
}
