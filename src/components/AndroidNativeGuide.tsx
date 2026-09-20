import React, { useState } from 'react';
import { Copy, Check, Download, ExternalLink, ShieldAlert, Cpu, Layers } from 'lucide-react';

export const AndroidNativeGuide: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const manifestCode = `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.emojifloat">

    <!-- Essential Permission to draw on top of all other apps -->
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="EmojiFloat"
        android:theme="@style/Theme.EmojiFloat">

        <activity android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Persistent Floating Window Service -->
        <service
            android:name=".FloatingEmojiService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="specialUse" />

    </application>
</manifest>`;

  const serviceCode = `package com.example.emojifloat

import android.app.Service
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.ImageView

class FloatingEmojiService : Service() {

    private lateinit var windowManager: WindowManager
    private lateinit var floatingView: View
    private lateinit var params: WindowManager.LayoutParams

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()

        // 1. Inflate overlay layout or custom ImageView
        floatingView = LayoutInflater.from(this).inflate(R.layout.layout_floating_emoji, null)
        val emojiImageView = floatingView.findViewById<ImageView>(R.id.emojiImageView)

        // 2. Setup System Alert Window parameters (Draw over apps)
        val layoutFlag = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE
        }

        params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutFlag,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = 100
            y = 300
        }

        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        windowManager.addView(floatingView, params)

        // 3. Touch listener for Drag & Place functionality anywhere on screen
        floatingView.setOnTouchListener(object : View.OnTouchListener {
            private var initialX = 0
            private var initialY = 0
            private var initialTouchX = 0f
            private var initialTouchY = 0f

            override fun onTouch(v: View, event: MotionEvent): Boolean {
                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        initialX = params.x
                        initialY = params.y
                        initialTouchX = event.rawX
                        initialTouchY = event.rawY
                        return true
                    }
                    MotionEvent.ACTION_MOVE -> {
                        params.x = initialX + (event.rawX - initialTouchX).toInt()
                        params.y = initialY + (event.rawY - initialTouchY).toInt()
                        windowManager.updateViewLayout(floatingView, params)
                        return true
                    }
                }
                return false
            }
        })
    }

    override fun onDestroy() {
        super.onDestroy()
        if (::floatingView.isInitialized) windowManager.removeView(floatingView)
    }
}`;

  const mainActivityCode = `package com.example.emojifloat

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private val OVERLAY_PERMISSION_REQ_CODE = 1234

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val btnStartOverlay = findViewById<Button>(R.id.btnStartOverlay)
        btnStartOverlay.setOnClickListener {
            checkAndStartOverlayPermission()
        }
    }

    private fun checkAndStartOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:$packageName")
            )
            startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE)
        } else {
            startFloatingEmojiService()
        }
    }

    private fun startFloatingEmojiService() {
        val intent = Intent(this, FloatingEmojiService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(intent)
        } else {
            startService(intent)
        }
        Toast.makeText(this, "Emoji overlay started!", Toast.LENGTH_SHORT).show()
    }
}`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              Android Studio Source
            </span>
            <span className="text-slate-400 text-xs font-mono">Kotlin • API 26+</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Native Floating Window System Overlay</h2>
          <p className="text-slate-400 text-sm">
            How to build the real system-wide floating emoji service using Android's <code className="text-cyan-400 font-mono">SYSTEM_ALERT_WINDOW</code> permission.
          </p>
        </div>
      </div>

      {/* Permission alert box */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex gap-3 text-amber-200">
        <ShieldAlert className="w-6 h-6 shrink-0 text-amber-400" />
        <div className="text-sm space-y-1">
          <p className="font-semibold text-amber-300">Important System Overlay Permission</p>
          <p className="text-amber-200/80">
            Android requires users to explicitly toggle <strong>"Display over other apps"</strong> in System Settings before floating emojis can appear over apps like WhatsApp, Instagram, YouTube, or the home launcher.
          </p>
        </div>
      </div>

      {/* Code Blocks */}
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">1</span>
              <span>AndroidManifest.xml (Permissions & Service)</span>
            </div>
            <button
              onClick={() => copyToClipboard(manifestCode, 'manifest')}
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              {copiedSection === 'manifest' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'manifest' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs font-mono overflow-x-auto text-cyan-300 custom-scrollbar">
            {manifestCode}
          </pre>
        </div>

        {/* Step 2 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">2</span>
              <span>FloatingEmojiService.kt (Window Manager & Dragging)</span>
            </div>
            <button
              onClick={() => copyToClipboard(serviceCode, 'service')}
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              {copiedSection === 'service' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'service' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs font-mono overflow-x-auto text-emerald-300 custom-scrollbar">
            {serviceCode}
          </pre>
        </div>

        {/* Step 3 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-white text-sm">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">3</span>
              <span>MainActivity.kt (Permission Request & Launch)</span>
            </div>
            <button
              onClick={() => copyToClipboard(mainActivityCode, 'main')}
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              {copiedSection === 'main' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'main' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs font-mono overflow-x-auto text-amber-300 custom-scrollbar">
            {mainActivityCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
