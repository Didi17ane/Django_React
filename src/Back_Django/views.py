from django.http import HttpResponse
from django.shortcuts import render
from datetime import datetime


def index(request):
    return render(request, "index.html", context={"date": datetime.today()})
    
