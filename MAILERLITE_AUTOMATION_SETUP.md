# MailerLite Automation Setup — Welcome Email με Agent Links

## Σκοπός
Όταν κάποιος εγγράφεται με το form και πατάει "Θέλω πρόσβαση", MailerLite στέλνει αυτόματα 
welcome email με τα 2 agent links (full + motivator).

---

## ΒΗΜΑ 1: Δημιουργία Automation

1. MailerLite Dashboard → Αριστερό μενού → **Automations** (ή "Workflows").
2. Κάνε κλικ **"Create automation"** ή **"New workflow"**.
3. **Trigger**: Επίλεξε **"Subscriber joins a group"** ή **"Form subscription"**.
4. Επίλεξε τη group: **"Oksyderkeis Tools"**.
5. Κάνε κλικ **"Next"** ή **"Create"**.

---

## ΒΗΜΑ 2: Δημιουργία Welcome Email

1. Στο automation editor, κάνε κλικ **"Add action"** → **"Send email"**.
2. **Θέμα email**: 
   ```
   Καλώς ήρθες — τα εργαλεία σου περιμένουν 🔓
   ```

3. **Σώμα email** (κείμενο / HTML):
   ```
   Γεια σας,

   Ευχαριστώ που εγγραφήκατε! Ξεκλειδώσατε πρόσβαση στα 2 πλήρη εργαλεία:

   ✓ Πλήρης Οικονομικός Οργανωτής
   Οργανώστε έσοδα, έξοδα και στόχους σε βάθος.
   👉 https://chatgpt.com/g/g-6a02313df92c819186e9adb804bd87db-ai-oikonomikos-organotes-full

   ✓ Motivator (No Excuses Coach)
   Πειθαρχία και συνέπεια για τους οικονομικούς σας στόχους.
   👉 https://chatgpt.com/g/g-6a0238c7b21c81919aa0ce4ba257bf7f-no-excuses-coach-truth-mode

   ⚠️ Αποφύγετε να εισάγετε ευαίσθητα δεδομένα (τραπεζικές πληροφορίες).

   Καθημερινές σκέψεις και ενημερώσεις σε:
   📲 Telegram: https://t.me/Oksyderkeis
   📺 YouTube: https://www.youtube.com/@oksyderkeis

   Με τιμή,
   David Τσούνης
   Oksyderkeis
   ```

4. Κάνε κλικ **"Save email"** ή **"Next"**.

---

## ΒΗΜΑ 3: Timing (Προαιρετικό)

1. **Πότε να στείλει**: Επίλεξε **"Send immediately"** (ή χρονοποίηση αν προτιμάς).
2. Κάνε κλικ **"Save"** ή **"Activate automation"**.

---

## ΒΗΜΑ 4: Ενεργοποίηση

1. Κάνε κλικ **"Publish"** ή **"Activate"** (πράσινο κουμπί).
2. Η automation είναι ζωντανή. Από εδώ κι εμπρός, κάθε νέος subscriber → welcome email αυτόματα.

---

## ✓ DONE

Τώρα όταν κάποιος εγγραφεί στο form:
1. Ανακατευθύνεται σε `/tools` (success page).
2. Παίρνει welcome email με τα 2 agent links.
3. Μπορεί να κάνει κλικ και να χρησιμοποιήσει τους βοηθούς αμέσως.

---

**Σημείωση:** Αν θέλεις να αλλάξεις το κείμενο ή τα links αργότερα, 
edit την automation → edit το email → save.
