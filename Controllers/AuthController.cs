using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BloodBridge;
using System.Text.RegularExpressions;
using BloodBridge.DTOs.AuthDtos;
using BloodBridge.Model;
using BloodBridge.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
namespace BloodBridge.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase

    {
        private readonly BloodBridgeDbContext _dbcontext;
        private readonly IConfiguration _configuration;
        public AuthController(BloodBridgeDbContext dbcontext, IConfiguration configuration)
        {
            _configuration = configuration;
            _dbcontext = dbcontext;
        }

        [HttpPost("register")]
        public  async Task<IActionResult>  Register([FromBody] RegisterDto dto)
        {
            if (_dbcontext.Users.Any(u => u.Email == dto.Email))
                return BadRequest(new { message = "Email already exists" });

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Password =  BCrypt.Net.BCrypt.HashPassword(dto.Password), 
                Phone = dto.Phone,
                Role = dto.Role
            };
            _dbcontext.Users.Add(user);
          await _dbcontext.SaveChangesAsync();
            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("Login")]
        public async Task<IActionResult>login([FromBody] LoginDto dto)
        {
            var user = _dbcontext.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                return BadRequest(new { message = "Invalid email or password" });
         
            if(user != null)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = System.Text.Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(ClaimTypes.Role, user.Role)
                    }),
                    Issuer = _configuration["Jwt:Issuer"],
                    Audience = _configuration["Jwt:Audience"],
                    Expires = DateTime.UtcNow.AddDays(7),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);
                return Ok(new { Token = tokenString,
                role=user.Role,
                name= user.Name
                });
            }
            return BadRequest(new { message = "Login failed" });

        }


       




    }
      
    
}
