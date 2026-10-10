#include <algorithm>
#include <array>
#include <chrono>
#include <fstream>
#include <iostream>
#include <map>
#include <sstream>
#include <stdexcept>
#include <string>
#include <vector>
#include <sys/resource.h>
using I=__int128_t;
using P=std::array<I,4>;
I add(I a,I b){I c;if(__builtin_add_overflow(a,b,&c))throw std::runtime_error("INT128_OVERFLOW");return c;}
I mul(I a,I b){I c;if(__builtin_mul_overflow(a,b,&c))throw std::runtime_error("INT128_OVERFLOW");return c;}
I neg(I a){return mul(a,-1);}
I ab(I a){return a<0?neg(a):a;}
I gcdI(I a,I b){a=ab(a);b=ab(b);while(b){I c=a%b;a=b;b=c;}return a;}
std::string str(I a){if(!a)return "0";bool minus=a<0;a=ab(a);std::string s;while(a){s.push_back('0'+a%10);a/=10;}if(minus)s.push_back('-');std::reverse(s.begin(),s.end());return s;}
P normalize(P v){I g=0;for(I x:v)g=gcdI(g,x);if(!g||!v[3])throw std::runtime_error("BAD_VERTEX");for(I&x:v)x/=g;if(v[3]<0)for(I&x:v)x=neg(x);return v;}
I eval(P p,P v){I r=0;for(int j=0;j<4;j++)r=add(r,mul(p[j],v[j]));return r;}
int sign(I x){return (x>0)-(x<0);}
I det(const std::vector<std::vector<I>>&m){int n=m.size();if(!n)return 1;if(n==1)return m[0][0];I r=0;for(int j=0;j<n;j++){std::vector<std::vector<I>> sub;for(int i=1;i<n;i++){std::vector<I> row;for(int k=0;k<n;k++)if(k!=j)row.push_back(m[i][k]);sub.push_back(row);}I term=mul(m[0][j],det(sub));r=add(r,j%2?neg(term):term);}return r;}
bool independent(const std::vector<int>&ids,const std::vector<P>&planes){int k=ids.size();for(int mask=0;mask<8;mask++)if(__builtin_popcount((unsigned)mask)==k){std::vector<std::vector<I>> m;for(int id:ids){std::vector<I> row;for(int j=0;j<3;j++)if(mask&(1<<j))row.push_back(planes[id][j]);m.push_back(row);}if(det(m))return true;}return false;}
struct V{P h;unsigned long long active=0;};
struct C{std::vector<int> v;std::string signs;};
struct Engine{
 std::vector<P> planes;std::vector<V> vertices;std::map<P,int> index;
 std::chrono::steady_clock::time_point start=std::chrono::steady_clock::now();double seconds;long peak=0;
 double elapsed(){return std::chrono::duration<double>(std::chrono::steady_clock::now()-start).count();}
 void guard(){if(elapsed()>seconds)throw std::runtime_error("TIME_LIMIT");struct rusage r;getrusage(RUSAGE_SELF,&r);peak=std::max(peak,r.ru_maxrss);
#ifdef __APPLE__
 if(peak>1536L*1024*1024)throw std::runtime_error("RSS_LIMIT");
#else
 if(peak>1536L*1024)throw std::runtime_error("RSS_LIMIT");
#endif
 }
 int vertex(P h){h=normalize(h);auto found=index.find(h);if(found!=index.end())return found->second;V v;v.h=h;for(size_t i=0;i<planes.size();i++)if(!eval(planes[i],h))v.active|=1ULL<<i;int id=vertices.size();vertices.push_back(v);index[h]=id;return id;}
 std::vector<int> shared(int a,int b,int prefix){std::vector<int> ids;for(int i=0;i<prefix;i++)if((vertices[a].active&vertices[b].active)&(1ULL<<i)){auto trial=ids;trial.push_back(i);if(independent(trial,planes))ids=trial;if(ids.size()==2)return ids;}return {};}
 int crossing(int a,int b,int wall,const std::vector<int>&basis){std::vector<std::vector<I>> m;std::vector<I> rhs;for(int id:basis){m.emplace_back(planes[id].begin(),planes[id].begin()+3);rhs.push_back(neg(planes[id][3]));}m.emplace_back(planes[wall].begin(),planes[wall].begin()+3);rhs.push_back(neg(planes[wall][3]));P h;h[3]=det(m);if(!h[3])throw std::runtime_error("EDGE_SINGULAR");for(int j=0;j<3;j++){auto altered=m;for(int i=0;i<3;i++)altered[i][j]=rhs[i];h[j]=det(altered);}h=normalize(h);
 int coordinate=0;while(coordinate<3&&mul(vertices[a].h[coordinate],vertices[b].h[3])==mul(vertices[b].h[coordinate],vertices[a].h[3]))coordinate++;
 if(coordinate==3)throw std::runtime_error("DUPLICATE_EDGE_ENDPOINTS");
 I ha=add(mul(h[coordinate],vertices[a].h[3]),neg(mul(vertices[a].h[coordinate],h[3])));
 I hb=add(mul(h[coordinate],vertices[b].h[3]),neg(mul(vertices[b].h[coordinate],h[3])));
 if(sign(ha)*sign(hb)!=-1)throw std::runtime_error("INTERSECTION_OUTSIDE_EDGE");return vertex(h);}
 std::vector<C> split(const C&c,int wall){std::vector<int> sv;bool pos=false,minus=false;for(int id:c.v){int s=sign(eval(planes[wall],vertices[id].h));sv.push_back(s);pos|=s>0;minus|=s<0;}if(!pos&&!minus)throw std::runtime_error("NON_FULL_DIMENSIONAL_CELL");if(!pos||!minus){C out=c;out.signs.push_back(pos?'+':'-');return {out};}
 C lo,hi;lo.signs=c.signs+'-';hi.signs=c.signs+'+';for(size_t i=0;i<c.v.size();i++){if(sv[i]<=0)lo.v.push_back(c.v[i]);if(sv[i]>=0)hi.v.push_back(c.v[i]);}
 for(size_t i=0;i<c.v.size();i++)for(size_t j=0;j<i;j++)if(sv[i]*sv[j]==-1){guard();auto basis=shared(c.v[i],c.v[j],wall);if(basis.size()==2){int id=crossing(c.v[i],c.v[j],wall,basis);for(int k=0;k<wall;k++){int s=sign(eval(planes[k],vertices[id].h));int expected=k<4?-1:(c.signs[k-4]=='+'?1:-1);if(s&&s!=expected)throw std::runtime_error("NEW_VERTEX_OUTSIDE_PARENT");}lo.v.push_back(id);hi.v.push_back(id);}}
 for(C*out:{&lo,&hi}){std::sort(out->v.begin(),out->v.end());out->v.erase(std::unique(out->v.begin(),out->v.end()),out->v.end());if(out->v.size()<4)throw std::runtime_error("BAD_SPLIT_VERTEX_COUNT");}return {lo,hi};}
};
int main(int argc,char**argv){std::string input,output;int maxplanes=42;size_t cap=50000;double seconds=60;for(int i=1;i<argc;i++){std::string a=argv[i];if(i+1==argc)return 2;std::string v=argv[++i];if(a=="--walls")input=v;else if(a=="--out")output=v;else if(a=="--max-planes")maxplanes=std::stoi(v);else if(a=="--cell-cap")cap=std::stoull(v);else if(a=="--seconds")seconds=std::stod(v);else return 2;}
 if(input.empty()||output.empty()||maxplanes<0||cap<1||cap>50000||!(seconds>0&&seconds<=180))return 2;
 Engine e;e.seconds=seconds;std::vector<C> cells;int processed=0;std::string reason="ALL_PLANES_PROCESSED";bool complete=false;
 try{e.planes={P{-1,0,0,0},P{1,-1,0,0},P{0,1,-1,0},P{0,0,1,-1}};std::ifstream in(input);long long x;while(in>>x){P p{};p[0]=x;for(int j=1;j<4;j++){long long z;if(!(in>>z))throw std::runtime_error("BAD_WALL_FILE");p[j]=z;}for(I z:p)if(ab(z)>1000000)throw std::runtime_error("NORMAL_COEFFICIENT_LIMIT");if(std::all_of(p.begin(),p.begin()+3,[](I z){return !z;}))throw std::runtime_error("CONSTANT_WALL");e.planes.push_back(p);}if(e.planes.size()>64||!in.eof())throw std::runtime_error("BAD_WALL_FILE");C simplex;for(P v:{P{0,0,0,1},P{0,0,1,1},P{0,1,1,1},P{1,1,1,1}})simplex.v.push_back(e.vertex(v));cells.push_back(simplex);
 for(int wall=4;wall<(int)e.planes.size();wall++){if(processed==maxplanes){reason="MAX_PLANES_LIMIT";break;}std::vector<C> next;for(const C&c:cells){e.guard();auto parts=e.split(c,wall);for(auto&part:parts)next.push_back(std::move(part));if(next.size()>cap)throw std::runtime_error("CELL_LIMIT");}cells=std::move(next);processed++;std::cerr<<"planes="<<processed<<" cells="<<cells.size()<<" vertices="<<e.vertices.size()<<" seconds="<<e.elapsed()<<"\n";}
 complete=processed==(int)e.planes.size()-4;
 }catch(const std::exception&ex){reason=ex.what();}
 std::ostringstream out;out<<"{\"status\":\""<<(complete?"COMPLETE_COVER":"PARTIAL_COVER")<<"\",\"reason\":\""<<reason<<"\",\"processed_planes\":"<<processed<<",\"pending_planes\":"<<(e.planes.size()>=4?e.planes.size()-4-processed:0)<<",\"cell_count\":"<<cells.size()<<",\"elapsed_seconds\":"<<e.elapsed()<<",\"peak_rss_native_units\":"<<e.peak<<",\"guards\":{\"cell_cap\":"<<cap<<",\"max_seconds\":"<<seconds<<",\"rss_bytes\":1610612736,\"artifact_bytes\":67108864,\"arithmetic\":\"CHECKED_INT128\"},\"planes\":[";
 for(size_t i=0;i<e.planes.size();i++){if(i)out<<',';out<<'[';for(int j=0;j<4;j++){if(j)out<<',';out<<'"'<<str(e.planes[i][j])<<'"';}out<<']';}out<<"],\"vertices\":[";
 for(size_t i=0;i<e.vertices.size();i++){if(i)out<<',';out<<"{\"h\":[";for(int j=0;j<4;j++){if(j)out<<',';out<<'"'<<str(e.vertices[i].h[j])<<'"';}out<<"],\"active\":[";bool first=true;for(size_t j=0;j<e.planes.size();j++)if(e.vertices[i].active&(1ULL<<j)){if(!first)out<<',';first=false;out<<j;}out<<"]}";}out<<"],\"cells\":[";
 for(size_t i=0;i<cells.size();i++){if(i)out<<',';out<<"{\"signs\":\""<<cells[i].signs<<"\",\"vertices\":[";for(size_t j=0;j<cells[i].v.size();j++){if(j)out<<',';out<<cells[i].v[j];}out<<"]}";}out<<"]}";std::string data=out.str();if(data.size()>67108864){data="{\"status\":\"PARTIAL_COVER\",\"reason\":\"ARTIFACT_LIMIT\",\"geometry_omitted\":true}";complete=false;}std::ofstream file(output);file<<data<<'\n';if(!file)return 2;std::cout<<"status="<<(complete?"COMPLETE_COVER":"PARTIAL_COVER")<<" reason="<<reason<<" planes="<<processed<<" cells="<<cells.size()<<" bytes="<<data.size()<<"\n";return complete?0:3;
}
