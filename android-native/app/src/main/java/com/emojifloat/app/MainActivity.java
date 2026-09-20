package com.emojifloat.app;
import android.Manifest; import android.app.Activity; import android.content.*; import android.content.pm.PackageManager; import android.net.Uri; import android.os.*; import android.provider.Settings; import android.webkit.*; import android.widget.Toast;
public class MainActivity extends Activity {
 private static final int OVERLAY_REQ=1001; private WebView webView; private ValueCallback<Uri[]> fileCallback; private String pendingPayload="[]";
 @Override protected void onCreate(Bundle state){super.onCreate(state);setContentView(R.layout.activity_main);webView=findViewById(R.id.webview);WebSettings s=webView.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setAllowFileAccess(true);s.setAllowContentAccess(true);s.setMediaPlaybackRequiresUserGesture(false);webView.setWebChromeClient(new WebChromeClient(){
            @Override public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams params){
                Intent i=params.createIntent();
                try { startActivityForResult(i, 3001); fileCallback=cb; } catch(Exception e){ cb.onReceiveValue(null); }
                return true;
            }
        });webView.addJavascriptInterface(new OverlayBridge(),"AndroidOverlay");webView.loadUrl("file:///android_asset/www/index.html");if(Build.VERSION.SDK_INT>=33&&checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED)requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS},2001);}
 private boolean canOverlay(){return Build.VERSION.SDK_INT<23||Settings.canDrawOverlays(this);} private void requestOverlay(){if(!canOverlay()){Intent i=new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:"+getPackageName()));startActivityForResult(i,OVERLAY_REQ);}}
 private void startService(String payload){Intent i=new Intent(this,FloatingEmojiService.class);i.putExtra("overlays",payload);if(Build.VERSION.SDK_INT>=26)startForegroundService(i);else startService(i);Toast.makeText(this,"Floating emojis started",Toast.LENGTH_SHORT).show();}
 @Override protected void onActivityResult(int requestCode,int resultCode,Intent data){
  super.onActivityResult(requestCode,resultCode,data);
  if(requestCode==3001&&fileCallback!=null){ Uri[] result=null; if(resultCode==RESULT_OK&&data!=null){ if(data.getClipData()!=null){ int n=data.getClipData().getItemCount(); result=new Uri[n]; for(int i=0;i<n;i++) result[i]=data.getClipData().getItemAt(i).getUri(); } else if(data.getData()!=null) result=new Uri[]{data.getData()}; } fileCallback.onReceiveValue(result); fileCallback=null; }
 }
 @Override protected void onResume(){super.onResume();if(canOverlay()&&!pendingPayload.equals("[]")){String p=pendingPayload;pendingPayload="[]";startService(p);}}
 public class OverlayBridge { @JavascriptInterface public void requestPermission(){requestOverlay();} @JavascriptInterface public void start(String payload){pendingPayload=payload==null?"[]":payload;if(canOverlay()){String p=pendingPayload;pendingPayload="[]";startService(p);}else requestOverlay();} @JavascriptInterface public void update(String payload){if(!canOverlay())return;Intent i=new Intent(MainActivity.this,FloatingEmojiService.class);i.setAction(FloatingEmojiService.ACTION_UPDATE);i.putExtra("overlays",payload==null?"[]":payload);if(Build.VERSION.SDK_INT>=26)startForegroundService(i);else startService(i);} @JavascriptInterface public void stop(){stopService(new Intent(MainActivity.this,FloatingEmojiService.class));} }
}
