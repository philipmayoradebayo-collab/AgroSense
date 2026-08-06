from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from prediction.models import PredictionHistory


@login_required
def dashboard(request):
    return render(request, "dashboard.html")


@login_required
def prediction_history(request):

    history = PredictionHistory.objects.filter(
        farmer=request.user.farmer
    ).order_by("-created_at")

    return render(
        request,
        "prediction_history.html",
        {
            "history": history,
        },
    )



def index(request):
    return render(request, "index.html")

