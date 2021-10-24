from django.contrib.auth import login, logout
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from rest_framework import generics
from rest_framework.authentication import BasicAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from api.auth.serializers import TokenSerializer, NewUserSerializer, UserSerializer, LoginSerializer


class XBasicAuth(BasicAuthentication):
    def authenticate_header(self, request):
        return 'XXXBasic'


@method_decorator(never_cache, name='get')
class ObtainAuthToken(generics.RetrieveAPIView):
    """
    Get a token you can use as a header instead of basic auth.

    Use the header with HTTP like:
        Authorization: Token 000000000000...
    """
    queryset = Token.objects.all()
    serializer_class = TokenSerializer
    authentication_classes = [XBasicAuth]
    permission_classes = (IsAuthenticated, )

    def get_object(self, queryset=None):
        return get_object_or_404(Token, user=self.request.user)


class UserCreate(generics.CreateAPIView):
    throttle_classes = [AnonRateThrottle]
    permission_classes = [AllowAny]

    serializer_class = NewUserSerializer

    def perform_create(self, serializer):
        """Log user in on successful registration"""
        new_user = serializer.save()
        login(self.request, new_user)


@method_decorator(never_cache, name='dispatch')
class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    User details - used to manage your own user
    """

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self, queryset=None):
        return self.request.user


class UserLogin(APIView):
    permission_classes = (AllowAny, )

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return Response(UserSerializer(user).data)


class UserLogout(APIView):
    def post(self, request):
        logout(request)
        return Response()