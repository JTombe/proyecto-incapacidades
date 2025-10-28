Using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]

public class UserController: BaseController {

  [HttpPost]
  [HttpGet]
  [HttpPut]
  [HttpDelete]
  
}