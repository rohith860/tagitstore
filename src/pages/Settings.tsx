import { useEffect, useState } from "react";
import {
  User,
  Bell,
  Moon,
  Lock,
  Globe,
  Mail,
  Save,
} from "lucide-react";

const translations = {
  English: {
    title: "Settings",
    description: "Manage your account and application preferences.",
    profile: "Profile",
    preferences: "Preferences",
    security: "Security",
    email: "Email Settings",
    save: "Save Changes",
  },

  Tamil: {
    title: "அமைப்புகள்",
    description: "உங்கள் கணக்கு மற்றும் பயன்பாட்டு விருப்பங்களை நிர்வகிக்கவும்.",
    profile: "சுயவிவரம்",
    preferences: "விருப்பங்கள்",
    security: "பாதுகாப்பு",
    email: "மின்னஞ்சல் அமைப்புகள்",
    save: "மாற்றங்களை சேமிக்கவும்",
  },

  Hindi: {
    title: "सेटिंग्स",
    description: "अपने खाते और एप्लिकेशन प्राथमिकताओं को प्रबंधित करें।",
    profile: "प्रोफ़ाइल",
    preferences: "प्राथमिकताएं",
    security: "सुरक्षा",
    email: "ईमेल सेटिंग्स",
    save: "परिवर्तन सहेजें",
  },
};


export default function Settings() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");

  const [darkMode,setDarkMode] = useState(false);
  const [notifications,setNotifications] = useState(false);

  const [language,setLanguage] = useState("English");
  const text = translations[language as keyof typeof translations];


  useEffect(()=>{

    const saved =
      localStorage.getItem("tagit-settings");


    if(saved){

      const data = JSON.parse(saved);

      setName(data.name);
      setEmail(data.email);
      setDarkMode(data.darkMode);
      setNotifications(data.notifications);
      setLanguage(data.language);

    }
    else{

      setName("Admin");
      setEmail("admin@tagitstore.com");
      setDarkMode(false);
      setNotifications(true);

    }


  },[]);



  const saveSettings = ()=>{


    const settings = {

      name,
      email,
      darkMode,
      notifications,
      language

    };


    localStorage.setItem(
      "tagit-settings",
      JSON.stringify(settings)
    );


    alert("Settings Saved Successfully!");

  };



  return (

<div
className={`min-h-screen p-8 transition-all duration-500 ${
darkMode
?
"bg-slate-900 text-white"
:
"bg-gradient-to-br from-slate-100 via-indigo-50 to-cyan-50 text-slate-800"
}`}
>


<div className="mb-10">

<h1
className={`text-4xl font-bold ${
darkMode ? "text-white":"text-slate-800"
}`}
>
{text.title}
</h1>


<p
className={
darkMode
?
"text-slate-300 mt-2"
:
"text-slate-500 mt-2"
}
>
{text.description}
</p>


</div>




<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


{/* PROFILE */}


<div
className={`rounded-3xl shadow-xl p-8 ${
darkMode
?
"bg-slate-800"
:
"bg-white"
}`}
>


<div className="flex items-center gap-3 mb-6">

<User className="text-indigo-500"/>

<h2 className="text-2xl font-bold">
{text.profile}
</h2>

</div>



<label>Name</label>

<input
value={name}
onChange={(e)=>setName(e.target.value)}
className={`w-full mt-2 mb-5 p-3 rounded-xl border ${
darkMode
?
"bg-slate-700 text-white border-slate-600"
:
"bg-white text-slate-800"
}`}
/>



<label>Email</label>

<input
value={email}
onChange={(e)=>setEmail(e.target.value)}
className={`w-full mt-2 p-3 rounded-xl border ${
darkMode
?
"bg-slate-700 text-white border-slate-600"
:
"bg-white text-slate-800"
}`}
/>


</div>
{/* PREFERENCES */}

<div
className={`rounded-3xl shadow-xl p-8 ${
darkMode
?
"bg-slate-800"
:
"bg-white"
}`}
>


<h2 className="text-2xl font-bold mb-6">
{text.preferences}
</h2>



<div className="space-y-6">


{/* DARK MODE */}

<div className="flex justify-between items-center">


<div className="flex items-center gap-3">

<Moon className="text-indigo-500"/>

<span>
Dark Mode
</span>

</div>



<button
onClick={()=>setDarkMode(!darkMode)}
className={`w-14 h-7 rounded-full flex items-center transition ${
darkMode
?
"bg-indigo-600 justify-end"
:
"bg-gray-300 justify-start"
}`}
>

<div className="w-6 h-6 bg-white rounded-full shadow-md"/>

</button>


</div>





{/* NOTIFICATIONS */}

<div className="flex justify-between items-center">


<div className="flex items-center gap-3">

<Bell className="text-green-500"/>

<span>
Notifications
</span>

</div>



<input
type="checkbox"
checked={notifications}
onChange={()=>setNotifications(!notifications)}
className="w-5 h-5"
/>


</div>






{/* LANGUAGE */}

<div>


<div className="flex items-center gap-3 mb-3">

<Globe className="text-cyan-500"/>

<span>
Language
</span>

</div>



<select

value={language}

onChange={(e)=>setLanguage(e.target.value)}

className={`w-full p-3 rounded-xl border ${
darkMode
?
"bg-slate-700 text-white border-slate-600"
:
"bg-white text-slate-800"
}`}

>


<option>
English
</option>


<option>
Tamil
</option>


<option>
Hindi
</option>


</select>


</div>


</div>

</div>





{/* SECURITY */}


<div
className={`rounded-3xl shadow-xl p-8 ${
darkMode
?
"bg-slate-800"
:
"bg-white"
}`}
>


<div className="flex items-center gap-3 mb-6">

<Lock className="text-red-500"/>

<h2 className="text-2xl font-bold">
{text.security}
</h2>

</div>



<div className="space-y-4">


<input
placeholder="Current Password"
type="password"
className={`w-full p-3 rounded-xl border ${
darkMode
?
"bg-slate-700 text-white border-slate-600"
:
"bg-white"
}`}
/>


<input
placeholder="New Password"
type="password"
className={`w-full p-3 rounded-xl border ${
darkMode
?
"bg-slate-700 text-white border-slate-600"
:
"bg-white"
}`}
/>



<input
placeholder="Confirm Password"
type="password"
className={`w-full p-3 rounded-xl border ${
darkMode
?
"bg-slate-700 text-white border-slate-600"
:
"bg-white"
}`}
/>



</div>


</div>





{/* EMAIL SETTINGS */}


<div
className={`rounded-3xl shadow-xl p-8 ${
darkMode
?
"bg-slate-800"
:
"bg-white"
}`}
>


<div className="flex items-center gap-3 mb-6">

<Mail className="text-blue-500"/>

<h2 className="text-2xl font-bold">
{text.email}
</h2>


</div>



<div className="space-y-4">


<label className="flex gap-3">

<input type="checkbox" defaultChecked/>

Receive Order Updates

</label>



<label className="flex gap-3">

<input type="checkbox" defaultChecked/>

Receive Marketing Emails

</label>



<label className="flex gap-3">

<input type="checkbox"/>

Receive Weekly Reports

</label>



</div>


</div>



</div>





{/* SAVE BUTTON */}


<div className="flex justify-end mt-10">


<button

onClick={saveSettings}

className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl shadow-lg"

>

<Save size={20}/>
{text.save}

</button>


</div>



</div>

  );

}