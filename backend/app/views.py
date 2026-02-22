from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

class LoginView(APIView):
    # Permitimos que cualquier persona pueda acceder a este endpoint sin estar autenticada
    permission_classes = [AllowAny]

    def post(self, request):
        # Capturamos los datos enviados en el cuerpo de la petición
        username = request.data.get('username')
        password = request.data.get('password')

        # authenticate() busca el usuario en la base de datos de Django 
        # y verifica que la contraseña sea correcta de forma segura
        user = authenticate(username=username, password=password)

        if user is not None:
            # Si el usuario existe y la contraseña es correcta, obtenemos o creamos su token
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'username': user.username
            }, status=status.HTTP_200_OK)
        else:
            # Si falla, devolvemos un error 401 Unauthorized
            return Response({
                'error': 'Credenciales inválidas'
            }, status=status.HTTP_401_UNAUTHORIZED)