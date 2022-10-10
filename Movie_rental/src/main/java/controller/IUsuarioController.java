package controller;

import java.util.Map;

public interface IUsuarioController {

    public String login(String usename, String contrasena);

    public String register(String usename, String contrasena,
    String nombre, String apellidos, String email, double saldo, boolean premium);
    
     public String pedir(String username);

    
}