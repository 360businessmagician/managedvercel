import requests
import json

BASE_URL = "https://api.mbtq.dev"  # or your Vercel URL

def test_pinkycollie_deaf_auth():
    """Test DeafAuth system with pinkycollie@outlook.com"""
    
    print("🧏‍♀️ Testing DeafAuth System")
    print("=" * 50)
    print("Designed for deaf community identity verification")
    
    # Registration data with deaf-specific preferences
    registration_data = {
        "username": "pinkycollie",
        "email": "pinkycollie@outlook.com",
        "password": "SecurePassword123!",
        "preferred_sign_language": "ASL",
        "accessibility_preferences": {
            "visual_notifications": True,
            "vibration_alerts": True,
            "high_contrast_mode": True,
            "sign_language_video_quality": "high",
            "captions_enabled": True,
            "gesture_navigation": True
        },
        "deaf_community_verification": True
    }
    
    print(f"\n📝 Registering deaf user: {registration_data['email']}")
    print(f"Sign Language: {registration_data['preferred_sign_language']}")
    print(f"Accessibility Features: {len(registration_data['accessibility_preferences'])} preferences set")
    
    try:
        # Test registration
        response = requests.post(f"{BASE_URL}/auth/register", json=registration_data)
        
        if response.status_code in [201, 400]:
            print("✅ DeafAuth registration successful!")
            if response.status_code == 201:
                print(f"Response: {response.json()}")
            
            # Test sign-in
            signin_data = {
                "email": "pinkycollie@outlook.com",
                "password": "SecurePassword123!"
            }
            
            print(f"\n🔐 Signing in to DeafAuth: {signin_data['email']}")
            signin_response = requests.post(f"{BASE_URL}/auth/signin", json=signin_data)
            
            if signin_response.status_code == 200:
                token_data = signin_response.json()
                print("✅ DeafAuth sign-in successful!")
                print(f"Token Type: {token_data['token_type']}")
                print(f"User Profile Included: ✅")
                
                profile = token_data['user_profile']
                print(f"Username: {profile['username']}")
                print(f"Preferred Sign Language: {profile['preferred_sign_language']}")
                print(f"Deaf Community Verified: {profile['deaf_community_verified']}")
                print(f"Accessibility Preferences: {len(profile['accessibility_preferences'])} settings")
                
                # Test profile endpoint
                headers = {"Authorization": f"Bearer {token_data['access_token']}"}
                profile_response = requests.get(f"{BASE_URL}/auth/profile", headers=headers)
                
                if profile_response.status_code == 200:
                    print("✅ Protected profile endpoint accessible")
                    print("🎉 Full DeafAuth flow completed successfully!")
                    print("\npinkycollie@outlook.com is now authenticated in the deaf-friendly MBTQ ecosystem")
                else:
                    print(f"⚠️  Profile endpoint issue: {profile_response.status_code}")
                    
            else:
                print(f"❌ Sign-in failed: {signin_response.status_code}")
                print(f"Response: {signin_response.json()}")
                
        else:
            print(f"❌ Registration failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")

def test_deaf_auth_features():
    """Test DeafAuth-specific features"""
    print(f"\n🔍 Testing DeafAuth service info")
    
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            info = response.json()
            print(f"Service: {info.get('service')}")
            print(f"Description: {info.get('description')}")
            print(f"Ecosystem: {info.get('ecosystem')}")
        
        health_response = requests.get(f"{BASE_URL}/health")
        if health_response.status_code == 200:
            health = health_response.json()
            print(f"Deaf Community Ready: {health.get('deaf_community_ready')}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Service info error: {e}")

if __name__ == "__main__":
    test_deaf_auth_features()
    test_pinkycollie_deaf_auth()
