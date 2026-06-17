---
name: Compliance Knowledge Base
description: Regulatory compliance, data protection (GDPR), audit requirements, and industry standards
markets:
  - berlin
  - frankfurt
  - munich
  - hamburg
  - eu-wide
devices:
  - solar-panel
  - battery-storage
  - inverter
  - car-charger
categories:
  - gdpr
  - audit
  - iso-standards
  - environmental
  - electrical-safety
  - grid-compliance
  - reporting
last_updated: 2025-11-25
---

# Compliance Knowledge Base

## GDPR Compliance for Smart Meter Data
> **Markets:** Berlin, Frankfurt | **Devices:** Solar Panel, Inverter | **Categories:** GDPR, Reporting

Smart meter data collected from Enpal photovoltaic installations constitutes personenbezogene Daten under Art. 4 DSGVO, as consumption patterns can be linked to identifiable natural persons through the customer's Zählpunktbezeichnung. In Berlin, processing of sub-15-minute interval consumption data requires separate informed consent under the Messstellenbetriebsgesetz (MsbG) §61, documented through a digital consent workflow in our customer portal with tamper-proof logging. Frankfurt installations connected to the Mainova smart meter gateway must implement the BSI TR-03109 security profile for end-to-end encryption of meter data in transit. Data retention for meter readings is limited to three billing cycles plus 12 months, after which granular data is aggregated and anonymized, with a documented Löschkonzept in place.

## ISO 27001 Information Security Requirements
> **Markets:** Berlin, Frankfurt, Munich, Hamburg | **Categories:** ISO-Standards, Audit

Enpal maintains ISO 27001:2022 certification for its Information Security Management System (ISMS), covering all customer data processing, device telemetry platforms, and internal IT infrastructure across all four German offices. The Statement of Applicability (SoA) addresses all 93 controls from Annex A, with specific emphasis on A.8.1 (asset management), A.12.4 (logging and monitoring), and A.14.2 (secure development for our customer portal). Annual surveillance audits are conducted by TÜV Rheinland, with the Statement of Applicability reviewed quarterly by the Information Security Steering Committee chaired by the CISO. All third-party vendors processing Enpal customer data must either hold their own ISO 27001 certification or pass our Vendor Security Assessment based on the CSA Cloud Controls Matrix.

## Electrical Safety Standards and VDE Compliance
> **Markets:** Berlin, Munich | **Devices:** Solar Panel, Battery-Storage, Inverter, Car-Charger | **Categories:** Electrical-Safety, Audit

All Enpal electrical installations must comply with VDE 0100 (Errichten von Niederspannungsanlagen) and VDE 0105-100 (Betrieb von elektrischen Anlagen), with mandatory Erstprüfung and Wiederholungsprüfung documented through Prüfprotokolle. Battery storage systems must meet VDE-AR-E 2510-50 for stationary energy storage systems, including fire safety provisions for lithium-ion chemistries and minimum clearance distances from escape routes. Munich installations in the Altstadt-Lehel district face additional requirements from the Branddirektion München for fire detection and suppression in battery storage rooms. All electricians must hold a valid VDE-Schaltberechtigung and complete annual VDE refresher training tracked through our LMS, with certification records available for audit within 48 hours.

## Environmental Compliance and Renewable Energy Law
> **Markets:** Berlin, Frankfurt, Munich, Hamburg, EU-Wide | **Devices:** Solar Panel, Battery-Storage, Inverter | **Categories:** Environmental, Reporting

Enpal installations must comply with the Erneuerbare-Energien-Gesetz (EEG 2023), requiring registration of all generation units in the Marktstammdatenregister within three weeks of commissioning and annual Stromkennzeichnung reporting. Under the EU Taxonomy Regulation (2020/852), Enpal's solar installations qualify as substantially contributing to climate change mitigation under Activity 7.6, requiring a Do No Significant Harm assessment against all four remaining environmental objectives. The ElektroG (WEEE obligations) requires Enpal as a producer to register with the Stiftung EAR and submit annual quantity reports for all placed-on-market electrical equipment. Battery recycling under the BattG-Melderegister is managed through our partnership with GRS Batterien for collection and recycling of end-of-life storage units.

## Grid Connection Compliance by Market
> **Markets:** Frankfurt, Munich | **Devices:** Solar Panel, Inverter | **Categories:** Grid-Compliance, Electrical-Safety

Grid connection in Frankfurt must comply with Mainova TAB 2023, which mandates a dedicated Zählerschrank meeting VDE-AR-N 4101 specifications and a Funkrundsteuerempfänger for systems above 10 kWp to enable remote curtailment by the Netzbetreiber. Munich installations require an Einspeisezusage from Stadtwerke München before construction begins, with the Inbetriebsetzungsanzeige submitted within five business days of commissioning through the Netzportal. Both markets require compliance with the System Stability Ordinance (SysStabV), including the ability to disconnect generation during frequency deviations through a NA-Schutz relay. Systems exceeding 135 kWp require Einheitenzertifikate and Komponentenzertifikate as specified in VDE-AR-N 4110 for medium-voltage connections.

## Internal Audit Procedures
> **Markets:** Berlin, Frankfurt, Munich, Hamburg | **Categories:** Audit, ISO-Standards, Reporting

Enpal's internal audit program follows a risk-based annual audit plan approved by the Audit Committee of the supervisory board, covering financial controls (ICS), IT general controls, and operational compliance across all four offices. ISO 27001 internal audits are conducted on a rolling 12-month cycle by a team of five certified internal auditors, with each critical process audited at least once every three years or annually for high-risk areas. Audit findings are classified as Major Non-Conformity, Minor Non-Conformity, or Opportunity for Improvement, with corrective action plans (CAPs) documented in the ServiceNow GRC module and tracked to closure within 90 days. The Chief Compliance Officer presents a quarterly audit status report to the Geschäftsführung summarizing open findings, overdue CAPs, and emerging risks.

## Incident Reporting Requirements
> **Markets:** Berlin, Frankfurt, Munich, Hamburg, EU-Wide | **Devices:** Battery-Storage, Inverter, Car-Charger | **Categories:** Reporting, Electrical-Safety, GDPR

Safety incidents involving electrical installations must be reported to the zuständige Gewerbeaufsichtsamt within 72 hours under BetrSichV §18, and serious incidents involving injury or fatality require immediate notification to the Berufsgenossenschaft. GDPR personal data breaches must be notified to the competent Landesdatenschutzbehörde within 72 hours of discovery per Art. 33 DSGVO, with our incident response team maintaining pre-drafted notification templates for each Aufsichtsbehörde. Battery-related incidents (thermal runaway, swelling, fire) require mandatory reporting to the Bundesanstalt für Materialforschung und -prüfung (BAM) under BattG §4 for safety investigations. All incidents are logged in our centralized Incident Management System (IMS) with a root cause analysis completed within 10 business days and preventive actions tracked through Jira.

## Anti-Corruption and Ethics Policy
> **Markets:** Berlin, Frankfurt, Munich, Hamburg, EU-Wide | **Categories:** Audit, Reporting

Enpal maintains a zero-tolerance policy toward corruption, bribery, and improper business practices, anchored in our Verhaltenskodex (Code of Conduct) aligned with the UK Bribery Act and the German Strafgesetzbuch §§299–302 on commercial bribery. All employees with procurement authority or customer-facing roles complete mandatory anti-corruption training annually, covering the distinction between permissible Geschäftsessen (up to EUR 40 per person) and improper Vorteilsgewährung. Gift acceptance is capped at EUR 25 per occasion and EUR 100 annually per business partner, with all gifts exceeding these thresholds requiring disclosure and approval from the Compliance team. Our Whistleblower-Hotline operated by an independent external ombudsperson guarantees confidentiality and protection from retaliation under the Hinweisgeberschutzgesetz (HinSchG), with reports investigated by the Internal Investigations unit within 30 days.
