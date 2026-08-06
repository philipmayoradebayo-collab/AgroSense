import joblib
import os
import pickle
import torch
from torch import nn

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")


class WeatherLSTM(nn.Module):
    def __init__(self, input_size, hidden_size=64, num_layers=2, output_size=2):
        super().__init__()

        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=0.2,
        )

        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        output, _ = self.lstm(x)
        output = self.fc(output[:, -1, :])
        return output


crop_model = joblib.load(os.path.join(MODELS_DIR, "crop_model.pkl"))

label_encoder= joblib.load(os.path.join(MODELS_DIR, "label_encoder.pkl"))
    

with open(os.path.join(MODELS_DIR, "scaler.pkl"), "rb") as f:
    scaler = pickle.load(f)

lstm_weather_model = WeatherLSTM(input_size=11)

lstm_weather_model.load_state_dict(
    torch.load(
        os.path.join(MODELS_DIR, "lstm_weather_model.pth"),
        map_location=torch.device("cpu"),
    )
)

lstm_weather_model.eval()




