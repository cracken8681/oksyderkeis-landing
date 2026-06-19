# MailerLite Automation Setup — aligned with the landing

## Σκοπός
Θέλουμε 2 ξεχωριστά flows που μιλάνε την ίδια γλώσσα με το landing:

1. **Newsletter** για πρακτικές ενημερώσεις, guides και εργαλεία
2. **Money OS Pro waitlist** για early access, launch price και product updates

Έτσι δεν ανακατεύονται οι εγγραφές και το email path παραμένει tools-first, calm, editorial.

---

## ΒΗΜΑ 1: Δημιουργία Automation

1. MailerLite Dashboard → Αριστερό μενού → **Automations** (ή "Workflows").
2. Κάνε κλικ **"Create automation"** ή **"New workflow"**.
3. **Trigger**: Επίλεξε **"Subscriber joins a group"**.
4. Επίλεξε τη group: **Money OS Pro Waitlist** (`188976667270579857`).
5. Κάνε κλικ **"Next"** ή **"Create"**.

---

## ΒΗΜΑ 2: Δημιουργία Welcome Email

1. Στο automation editor, κάνε κλικ **"Add action"** → **"Send email"**.
2. **Θέμα email**:
   ```
   Μπήκες στη waitlist του Money OS Pro — εδώ θα στήνουμε το σύστημα μαζί
   ```

3. **Σώμα email** (κείμενο / HTML):
   ```
   Γεια σου,

   Μπήκες στη waitlist του Money OS Pro.

   Αυτό σημαίνει ότι θα παίρνεις πρώτος:
   - early access όταν ανοίξει
   - launch price πριν ανέβει
   - σύντομα product notes και πρακτικά updates

   Το Money OS Pro είναι για να βλέπεις καθαρά έσοδα, έξοδα, στόχους και πειθαρχία.
   Αν θες να δεις πρώτα το hub, το landing είναι εδώ:
   https://oksyderkeis.vercel.app
   ```

4. Κάνε κλικ **"Save email"** ή **"Next"**.

---

## ΒΗΜΑ 3: Timing (Προαιρετικό)

1. **Πότε να στείλει**: Επίλεξε **"Send immediately"**.
2. Κάνε κλικ **"Save"** ή **"Activate automation"**.

---

## ΒΗΜΑ 4: Ενεργοποίηση

1. Κάνε κλικ **"Publish"** ή **"Activate"** (πράσινο κουμπί).
2. Η automation είναι ζωντανή. Από εδώ κι εμπρός, κάθε νέος subscriber του waitlist → welcome email αυτόματα.

---

## ✓ DONE

Τώρα όταν κάποιος εγγραφεί στο waitlist form:
1. Ανακατευθύνεται σε `/tools` (success page).
2. Παίρνει welcome email με το σωστό προϊόν/updates flow.
3. Μπορεί να κάνει κλικ και να χρησιμοποιήσει τους βοηθούς αμέσως.

---

## Newsletter automation

1. Φτιάξε group: **Oksyderkeis Newsletter** (`190415310059209948`).
2. Φτιάξε ξεχωριστό embedded form μόνο για editorial signup.
3. Trigger automation: όταν subscriber μπαίνει στο newsletter group.
4. **Email #1 - Welcome / editorial orientation**
   - Θέμα: `Καλώς ήρθες — εδώ θα βρίσκεις εργαλεία, όχι θόρυβο`
   - Κύριο μήνυμα: το site είναι hub για πρακτικά εργαλεία, AI helpers και money systems
   - Σύνδεσμος: landing page + tool page
5. **Email #2 - Start here**
   - Θέμα: `Ξεκίνα από εδώ: ο AI οικονομικός οργανωτής`
   - Κύριο μήνυμα: 1 CTA προς τον δωρεάν βοηθό και 1 CTA προς το Money OS Pro
6. **Email #3 - Weekly editorial**
   - Περιεχόμενο: 1 εργαλείο, 1 ιδέα, 1 πρακτικό action item
   - Tone: calm, concise, specific
7. Αν θέλεις να προωθήσεις το Money OS Pro και στους newsletter subscribers, πρόσθεσε ένα soft pitch email 3-5 μέρες μετά την εγγραφή.

---

**Σημείωση:** Αν θέλεις να αλλάξεις το κείμενο ή τα links αργότερα, 
edit την automation → edit το email → save.
