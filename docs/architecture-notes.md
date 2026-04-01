**A 3-step breakdown of how connections are made in MedInsight AI…**  
\* AI was used here to help label terminology/component names (especially Step 3). 

**Step 1: The Digital ID (Authentication)**

* Before a user can chat, the frontend must verify who they are.   
  * The React frontend uses the Supabase Auth API to ensure the user is logged in.   
  * This assigns a unique **user\_id** to each person. This ID is what links their chat history to their specific profiles table. 

**Step 2: The Connection (Edge Functions)**

* When a user hits “send” on a chat message, the frontend doesn’t talk directly to Google Gemini.   
  * The frontend calls our Supabase Edge Function (**health-chat**) via a secure POST request.   
  * The function takes the message and user profile data, bundles them together, and then calls the Google Gemini API behind the scenes.   
    * This way, our Gemini API Key stays safe and hidden in the cloud (the backend) rather than sitting in the user’s browser (the frontend) where anyone could steal it.

**Step 3: The Memory Connection (PostgREST API)**

* Every message and profile update are saved to the SQL tables.  
  * Supabase uses an API called PostgREST to automatically turn our SQL tables into a “Web API.”   
  * When the AI finishes its sentence, the frontend makes a second call: **supabase.from(‘chat\_messages’).insert(...)**. This instantly writes the new message to our database so it’s there when a user refreshes the page.

