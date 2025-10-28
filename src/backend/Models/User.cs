namespace app.Models
{
  public class User {
    
    public int Id {get; set; };
    public string Mail {get; set; };
    public string Rol {get; set; };
    private string HashPassword {get; set; };
    public string Departament {get; set; };
    public bool IsActive {get; set;};
    public DateTime CreatedDate {get; set;};
  }

  public class RrhhUser : user {
    
  }

  public class FinanceUser : user {

  }

  public class SupervisorUser: user {

  }

  public class ManagerUser: SupervisorUser {

  }
}