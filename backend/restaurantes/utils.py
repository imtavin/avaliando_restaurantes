import os
import gspread
from google.oauth2.service_account import Credentials

# 🔹 Configuração do Google Sheets
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVICE_ACCOUNT_FILE = os.path.join(BASE_DIR, "restaurantes", "credentials.json")
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

def conectar_sheets():
    """Autentica e retorna os worksheets do Google Sheets."""
    try:
        credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        client = gspread.authorize(credentials)
        SPREADSHEET_ID = "1OiowO-bIHFGz-F5f_XtNgECfeDl6vmxBmNGu4StqEYA"
        restaurantes_sheet = client.open_by_key(SPREADSHEET_ID).worksheet("Restaurantes")
        avaliacoes_sheet = client.open_by_key(SPREADSHEET_ID).worksheet("Avaliacoes")
        return restaurantes_sheet, avaliacoes_sheet
    except Exception as e:
        print(f"Erro ao conectar ao Google Sheets: {e}")
        raise
