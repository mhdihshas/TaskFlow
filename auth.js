'use strict';
const AUTH_USERS_KEY='tf_users_v1';
const AUTH_SESSION_KEY='tf_session_v1';
const AUTH_THEME_KEY='tf_theme';
const auth$=id=>document.getElementById(id);

function readUsers(){
  try{const value=JSON.parse(localStorage.getItem(AUTH_USERS_KEY)||'[]');return Array.isArray(value)?value:[];}catch{return [];}
}
function readSession(){
  try{return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY)||'null');}catch{return null;}
}
function saveSession(user){
  localStorage.setItem(AUTH_SESSION_KEY,JSON.stringify({name:user.name,email:user.email,login_at:new Date().toISOString()}));
}
function bytesToHex(bytes){return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('');}
function randomHex(size=16){const bytes=new Uint8Array(size);crypto.getRandomValues(bytes);return bytesToHex(bytes);}
async function hashPassword(password,salt){
  const data=new TextEncoder().encode(`${salt}:${password}`);
  const digest=await crypto.subtle.digest('SHA-256',data);
  return bytesToHex(digest);
}
function setMessage(message,type='error'){
  const box=auth$('authMessage');
  if(!box)return;
  box.textContent=message;
  box.className=`auth-message ${type}`;
  box.hidden=!message;
}
function setBusy(form,busy,label){
  const btn=form?.querySelector('[type="submit"]');
  if(!btn)return;
  if(!btn.dataset.label)btn.dataset.label=btn.textContent;
  btn.disabled=busy;
  btn.textContent=busy?label:btn.dataset.label;
}
function applyAuthTheme(theme,{remember=true}={}){
  const dark=theme==='dark';
  document.documentElement.classList.toggle('dark',dark);
  if(remember)try{localStorage.setItem(AUTH_THEME_KEY,theme);}catch{}
  const btn=auth$('authTheme');
  if(btn){btn.textContent=dark?'☀':'☾';btn.setAttribute('aria-label',dark?'Switch to light appearance':'Switch to dark appearance');btn.title=btn.getAttribute('aria-label');}
  const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=dark?'#17241d':'#184d3e';
}
function initTheme(){
  let stored=null;try{stored=localStorage.getItem(AUTH_THEME_KEY);}catch{}
  applyAuthTheme(stored||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'),{remember:false});
  auth$('authTheme')?.addEventListener('click',()=>applyAuthTheme(document.documentElement.classList.contains('dark')?'light':'dark'));
}
function normalEmail(value){return value.trim().toLowerCase();}
function validEmail(email){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);}

async function handleRegister(event){
  event.preventDefault();setMessage('');
  const form=event.currentTarget;
  const name=auth$('name').value.trim();
  const email=normalEmail(auth$('email').value);
  const password=auth$('password').value;
  const confirm=auth$('confirmPassword').value;
  if(name.length<2)return setMessage('Enter your name.');
  if(!validEmail(email))return setMessage('Enter a valid email address.');
  if(password.length<8)return setMessage('Password must contain at least 8 characters.');
  if(password!==confirm)return setMessage('Passwords do not match.');
  const users=readUsers();
  if(users.some(user=>user.email===email))return setMessage('An account with this email already exists. Sign in instead.');
  setBusy(form,true,'Creating account…');
  try{
    const salt=randomHex();
    const password_hash=await hashPassword(password,salt);
    const user={id:crypto.randomUUID?.()||`u_${Date.now()}`,name,email,salt,password_hash,created_at:new Date().toISOString()};
    users.push(user);localStorage.setItem(AUTH_USERS_KEY,JSON.stringify(users));saveSession(user);
    location.href='task.html';
  }catch{setMessage('Could not create the local demo account in this browser.');setBusy(form,false);}
}

async function handleLogin(event){
  event.preventDefault();setMessage('');
  const form=event.currentTarget;
  const email=normalEmail(auth$('email').value);
  const password=auth$('password').value;
  if(!validEmail(email)||!password)return setMessage('Enter your email and password.');
  const user=readUsers().find(item=>item.email===email);
  if(!user)return setMessage('No account was found for this email. Register first.');
  setBusy(form,true,'Signing in…');
  try{
    const password_hash=await hashPassword(password,user.salt);
    if(password_hash!==user.password_hash){setBusy(form,false);return setMessage('Incorrect password.');}
    saveSession(user);location.href='task.html';
  }catch{setMessage('Could not sign in on this browser.');setBusy(form,false);}
}

function togglePassword(button){
  const input=document.getElementById(button.dataset.target);
  if(!input)return;
  const show=input.type==='password';input.type=show?'text':'password';button.textContent=show?'Hide':'Show';button.setAttribute('aria-pressed',String(show));
}

document.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  if(readSession()?.email){location.replace('task.html');return;}
  auth$('loginForm')?.addEventListener('submit',handleLogin);
  auth$('registerForm')?.addEventListener('submit',handleRegister);
  document.querySelectorAll('[data-password-toggle]').forEach(btn=>btn.addEventListener('click',()=>togglePassword(btn)));
});
