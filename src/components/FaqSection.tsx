export const FAQ_ITEMS = [
  {
    q: 'What is a novated lease?',
    a: 'A novated lease is a three-way agreement between you, your employer, and a lease provider where your employer pays for your car and its running costs out of your pre-tax salary. It is only available to PAYG employees in Australia whose employers offer salary packaging.',
  },
  {
    q: 'How does the EV FBT exemption work?',
    a: 'Since July 2022, battery electric and hydrogen fuel-cell vehicles under the luxury car tax threshold for fuel-efficient vehicles ($91,387 for FY2025-26) are exempt from Fringe Benefits Tax when leased novated. That means 100% of the package comes out of your pre-tax salary — no post-tax ECM contribution required.',
  },
  {
    q: 'Do plug-in hybrids (PHEVs) still qualify?',
    a: 'No — not for new leases. The PHEV FBT exemption ended on 1 April 2025. Existing PHEV leases that were in place before that date are grandfathered until the lease ends.',
  },
  {
    q: 'How much can I actually save with an EV novated lease?',
    a: 'For a $60,000 BEV on a 5-year lease and a $120,000 salary, the FBT exemption typically saves $20,000 to $30,000 over the term compared with paying cash or taking a conventional car loan. Exact savings depend on your marginal tax rate, kms driven, and the lease provider\'s finance rate.',
  },
  {
    q: 'What happens at the end of the lease?',
    a: 'You have three options: pay the ATO-prescribed residual (about 28% of the ex-GST price on a 5-year lease) to keep the car, refinance the residual into a new lease, or hand the car back. There is no option to own the car without paying the residual.',
  },
  {
    q: 'What if I change jobs during the lease?',
    a: 'The lease transfers with you if your new employer offers salary packaging, or it can be converted to a regular consumer car loan. Speak to your lease provider before resigning — some providers make this easier than others.',
  },
  {
    q: 'Is a novated lease always the cheapest option?',
    a: 'No. A novated lease almost always wins for eligible EVs on salaries above about $90,000. For cheaper ICE cars on lower salaries, paying cash or taking a regular car loan can be cheaper once fleet fees and ECM contributions are factored in. Use the calculator to compare all four paths.',
  },
  {
    q: 'Do I need financial advice to get a novated lease?',
    a: 'The calculator and content on this site are general information only. For your specific circumstances — especially if you are near a Medicare surcharge or HELP threshold — speak with a registered tax agent or licensed financial adviser. See our disclosure for how we make money.',
  },
];

export function FaqSection() {
  return (
    <section className="border-t">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Frequently asked questions
        </h2>
        <div className="mt-8 divide-y">
          {FAQ_ITEMS.map((item) => (
            <div key={item.q} className="py-5">
              <h3 className="font-semibold">{item.q}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
