from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

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


class RegisterView(APIView):
    # Permitimos que cualquiera pueda crear un usuario (vital para este caso)
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # 1. Validamos que nos envíen ambos datos
        if not username or not password:
            return Response({
                'error': 'Por favor provee un usuario y una contraseña'
            }, status=status.HTTP_400_BAD_REQUEST)

        # 2. Verificamos que el usuario no exista ya en la base de datos
        if User.objects.filter(username=username).exists():
            return Response({
                'error': 'Este nombre de usuario ya está en uso'
            }, status=status.HTTP_400_BAD_REQUEST)

        # 3. Creamos el usuario. 
        # IMPORTANTE: Usamos create_user() y no create() para que 
        # Django encripte la contraseña correctamente.
        user = User.objects.create_user(username=username, password=password)
        
        # 4. (Opcional pero recomendado) Le creamos su token de una vez
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'message': 'Usuario creado exitosamente',
            'token': token.key,
            'user_id': user.pk,
            'username': user.username
        }, status=status.HTTP_201_CREATED)