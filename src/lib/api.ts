
const API_BASE_URL = 'http://localhost:8000';

interface LoginData {
  username: string; // FastAPI OAuth2PasswordRequestForm uses 'username' field
  password: string;
}

interface SignupData {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

interface UserResponse {
  id: number;
  email: string;
  created_at: string;
}

export class ApiService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  static async signup(data: SignupData): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Signup failed');
    }

    return response.json();
  }

  static async login(data: LoginData): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  }

  static async getCurrentUser(): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        ...this.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    return response.json();
  }

  static async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  }
}
